import {
    Directive,
    ElementRef,
    OnInit,
} from '@angular/core';
import { interval } from 'rxjs/observable/interval';
import { map } from 'rxjs/operators/map';
import { take } from 'rxjs/operators/take';

import * as lodash from 'lodash';

import { 
    Color,
    Fractal,
    SnowFlake,
    Star,
} from './models';
import { MainFractal } from './models/main-fractal';
import { SpawnInterval, Tree } from './models/tree';
import { WindTargetBuffer } from './models/wind-target-buffer';

@Directive({
    selector: '[jtdcFractalAnimation]'
})
export class FractalAnimationDirective implements OnInit {

    private canvas : HTMLCanvasElement;

    private currentTimeStamp = 0;

    private mainFractalInitialLineLength = 250;

    private timeBeforeSpawningStars = 5;
    private timeBeforeSpawingSnowFlakes = 7;
    private timeBetweenSnowFlakeSpawns = 0.15;
    private timeBetweenStarSpawns = 0.01;

    private numberOfStarsToSpawn = 250;
    private numberOfTreesToSpawnPer1000X = 8;
    private treeSpawnBufferZoneProportion = 0.1;
    private numberOfBushesToSpawnPer1000X = 30;
    private bushSpawnBufferZoneProportion = 0.1;

    private maxWind = Math.PI / 6;

    private snowFlakes : SnowFlake[] = new Array<SnowFlake>();
    private stars : Star[] = new Array<Star>();
    private trees : Tree[] = new Array<Tree>();
    private bushes : Tree[] = new Array<Tree>();

    constructor(private element : ElementRef) {

        this.canvas = this.element.nativeElement as HTMLCanvasElement;
    }

    public ngOnInit() : void {

        const context = this.canvas.getContext('2d');
        
        const boundingRect = this.canvas.getBoundingClientRect();
        const canvasWidth = boundingRect.width;
        const canvasHeight = boundingRect.height;
        
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        const mainFractal = new MainFractal(canvasWidth, this.mainFractalInitialLineLength / 2);
        
        const cachedBackgroundCanvas = document.createElement('canvas');
        cachedBackgroundCanvas.width = this.canvas.width;
        cachedBackgroundCanvas.height = this.canvas.height;

        const cachedBackgroundContext = cachedBackgroundCanvas.getContext('2d');

        cachedBackgroundContext.fillStyle = 'black';
        cachedBackgroundContext.fillRect(0, 0, cachedBackgroundCanvas.width, cachedBackgroundCanvas.height);

        context.lineCap = 'round';
        context.lineJoin = 'round';

        let totalTimePassed = 0;
        let mainFractalCompleteAndCachedToBackground = false;
        let timeSinceLastSnowFlakeSpawn = 0;
        let timeSinceLastStarSpawned = 0;
        let allStarsSpawned = false;

        const treeSpawnIntervals = this.getSpawnIntervals(
            canvasWidth, 
            this.numberOfTreesToSpawnPer1000X, 
            this.treeSpawnBufferZoneProportion,
        );
        treeSpawnIntervals.forEach(spawnInterval => {
            this.trees.push(new Tree(spawnInterval, canvasHeight, false));
        });

        const bushSpawnIntervals = this.getSpawnIntervals(
            canvasWidth,
            this.numberOfBushesToSpawnPer1000X,
            this.bushSpawnBufferZoneProportion,
        );
        bushSpawnIntervals.forEach(spawnInterval => {
            this.bushes.push(new Tree(spawnInterval, canvasHeight, true));
        });

        const windTargetBuffer = new WindTargetBuffer();

        const doFrame = (timeStamp : number) => {

            const deltaTime = (timeStamp - this.currentTimeStamp) / 1000;
    
            this.currentTimeStamp = timeStamp;

            if (deltaTime > 0.2) {
                window.requestAnimationFrame(doFrame);
                return;
            } else {
                this.currentTimeStamp = timeStamp;
            }

            totalTimePassed += deltaTime;

            if (totalTimePassed >= this.timeBeforeSpawningStars && !allStarsSpawned) {

                if (timeSinceLastStarSpawned > this.timeBetweenStarSpawns) {

                    this.stars.push(new Star(
                        canvasWidth,
                        canvasHeight,
                        canvasWidth / 2,
                        mainFractal.endOfAnimationCenterYCoordinate,
                        this.mainFractalInitialLineLength,
                    ));

                    timeSinceLastStarSpawned = 0;
                } else {
                    timeSinceLastStarSpawned += deltaTime;
                }

                if (this.stars.length >= this.numberOfStarsToSpawn) {
                    allStarsSpawned = true;
                }
            }

            if (totalTimePassed >= this.timeBeforeSpawingSnowFlakes) {
                if (timeSinceLastSnowFlakeSpawn > this.timeBetweenSnowFlakeSpawns) {
                    this.snowFlakes.push(new SnowFlake(canvasWidth, canvasWidth / 2, this.mainFractalInitialLineLength));
                    timeSinceLastSnowFlakeSpawn = 0;
                } else {
                    timeSinceLastSnowFlakeSpawn += deltaTime;
                }
            }

            this.stars.forEach(star => star.update(deltaTime));

            windTargetBuffer.update(deltaTime);

            if (mainFractal.animationComplete && !mainFractalCompleteAndCachedToBackground) {
                mainFractal.drawInitialLine(cachedBackgroundContext);
                mainFractal.draw(cachedBackgroundContext);
                mainFractalCompleteAndCachedToBackground = true;
            }

            this.stars.filter(star => star.fadedIn && !star.drawCachedToBackground).forEach(star => {
                star.drawNonTwinkling(cachedBackgroundContext);
                star.drawCachedToBackground = true;
            });

            context.drawImage(cachedBackgroundCanvas, 0, 0);

            if (!mainFractalCompleteAndCachedToBackground) {
                mainFractal.update(deltaTime);
                mainFractal.drawInitialLine(context);
                if (mainFractal.initialLineDrawn) {
                    mainFractal.draw(context);
                }
            }

            this.stars.filter(star => !star.drawCachedToBackground || star.twinkling).forEach(star => {
                star.draw(context);
            });

            this.snowFlakes.forEach(snowFlake => {
                snowFlake.update(deltaTime, canvasHeight);
                //snowFlake.draw(context);
                snowFlake.drawCached(context);
            });
            
            // this.trees.forEach(tree => {
            //     tree.update(deltaTime, windTargetBuffer, canvasHeight);
            //     tree.drawInitialLine(context, canvasHeight);
            //     tree.draw(context);
            // });

            // this.bushes.forEach(bush => {
            //     bush.draw(context);
            // });

            this.snowFlakes = this.snowFlakes.filter(snowFlake => !snowFlake.removeThisFrame);

            window.requestAnimationFrame(doFrame);
        };

        window.requestAnimationFrame(doFrame);
    }

    private getSpawnIntervals(width : number, numberToSpawnPer1000X : number, bufferZoneProportion : number) : SpawnInterval[] {
        
        const spawnIntervalWidth = 1000 / numberToSpawnPer1000X;
        const numberOfSpawnIntervals = Math.floor(width / spawnIntervalWidth);
        const spawnIntervals = new Array<SpawnInterval>();
        let currentIntervalBoundary = (width / 2) - ((numberOfSpawnIntervals / 2) * spawnIntervalWidth);
        
        do {
            spawnIntervals.push({ 
                min: currentIntervalBoundary + bufferZoneProportion * spawnIntervalWidth,
                max: currentIntervalBoundary + (1 - bufferZoneProportion) * spawnIntervalWidth,
            });

            currentIntervalBoundary += spawnIntervalWidth;
        } while ( currentIntervalBoundary < width);

        return spawnIntervals;
    }
}
