import {
    Directive,
    ElementRef,
    OnDestroy,
    OnInit,
} from '@angular/core';

import * as lodash from 'lodash';

import { EventArgs, HomeEventsService } from '../services/home-events.service';
import { 
    Bush,
    Color,
    Fractal,
    FullTree,
    MainFractal,
    SnowFlake,
    SpawnInterval,
    Star,
    Tree,
    WindTargetBuffer,
} from './models';

export class EAMainFractalAnimationDone extends EventArgs { }
export class EAMainFractalGrowthDone extends EventArgs {}

@Directive({
    selector: '[jtdcFractalAnimation]'
})
export class FractalAnimationDirective implements OnInit, OnDestroy {

    private canvas : HTMLCanvasElement;

    private continueAnimation = true;

    private currentTimeStamp = 0;

    private mainFractalInitialLineLength = 250;

    private timeBeforeSpawningStars = 5;
    private timeBetweenStarSpawns = 0.01;
    private numberOfStarsToSpawn = 250;

    private timeBeforeSpawingSnowFlakes = 7;
    private timeBetweenSnowFlakeSpawns = 0.15;

    private timeBeforeSpawingTreesAndBushes = 9;
    private timeBetweenTreeSpawns = 0.5;
    private timeBetweenBushSpawns = 0.1;
    private numberOfTreesToSpawnPer1000X = 10;
    private treeSpawnBufferZoneProportion = 0.1;
    private numberOfBushesToSpawnPer1000X = 40;
    private bushSpawnBufferZoneProportion = 0.1;

    private initialBackgroundColor : Color = new Color(210, 200, 195, 1);

    private maxWind = Math.PI / 6;

    private snowFlakes : SnowFlake[] = new Array<SnowFlake>();
    private stars : Star[] = new Array<Star>();
    private trees : FullTree[] = new Array<FullTree>();
    private bushes : Bush[] = new Array<Bush>();

    constructor(
        private element : ElementRef,
        private homeEventsService : HomeEventsService,
    ) {
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

        context.lineCap = 'round';
        context.lineJoin = 'round';

        let totalTimePassed = 0;
        let mainFractalGrowthFinishedEventEmitted = false;
        let mainFractalCompleteAndCachedToBackground = false;
        let timeSinceLastSnowFlakeSpawn = 0;
        let timeSinceLastStarSpawned = 0;
        let allStarsSpawned = false;
        let timeSinceLastTreeSpawned = 0;
        let timeSinceLastBushSpawned = 0;

        const treeSpawnIntervals = this.getSpawnIntervals(
            canvasWidth, 
            this.numberOfTreesToSpawnPer1000X, 
            this.treeSpawnBufferZoneProportion,
        );

        const bushSpawnIntervals = this.getSpawnIntervals(
            canvasWidth,
            this.numberOfBushesToSpawnPer1000X,
            this.bushSpawnBufferZoneProportion,
        );

        const windTargetBuffer = new WindTargetBuffer();

        cachedBackgroundContext.fillStyle = this.initialBackgroundColor.toContextStyleString();
        cachedBackgroundContext.fillRect(0, 0, cachedBackgroundCanvas.width, cachedBackgroundCanvas.height);

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
                    this.snowFlakes.push(new SnowFlake(canvasWidth, canvasHeight));
                    timeSinceLastSnowFlakeSpawn = 0;
                } else {
                    timeSinceLastSnowFlakeSpawn += deltaTime;
                }
            }

            if (treeSpawnIntervals.length > 0 && totalTimePassed >= this.timeBeforeSpawingTreesAndBushes) {

                if (timeSinceLastTreeSpawned > this.timeBetweenTreeSpawns) {

                    const randomIntervalIndex = lodash.random(0, treeSpawnIntervals.length - 1, false);
                    const randomInterval = treeSpawnIntervals[randomIntervalIndex];
                    treeSpawnIntervals.splice(randomIntervalIndex, 1);

                    this.trees.push(new FullTree(randomInterval, canvasHeight, windTargetBuffer));

                    timeSinceLastTreeSpawned = 0;

                } else {
                    timeSinceLastTreeSpawned += deltaTime;
                }
            }

            if (bushSpawnIntervals.length > 0 && totalTimePassed >= this.timeBeforeSpawingTreesAndBushes) {

                if (timeSinceLastBushSpawned > this.timeBetweenBushSpawns) {

                    const randomIntervalIndex = lodash.random(0, bushSpawnIntervals.length - 1, false);
                    const randomInterval = bushSpawnIntervals[randomIntervalIndex];
                    bushSpawnIntervals.splice(randomIntervalIndex, 1);

                    this.bushes.push(new Bush(randomInterval, canvasHeight));

                    timeSinceLastBushSpawned = 0;

                } else {
                    timeSinceLastBushSpawned += deltaTime;
                }
            }

            windTargetBuffer.update(deltaTime);
            
            this.stars.forEach(star => star.update(deltaTime));
            this.trees.forEach(tree => tree.update(deltaTime));
            this.bushes.forEach(bush => bush.update(deltaTime));

            if (totalTimePassed < this.timeBeforeSpawningStars) {
                const fractionTimeBeforeStarSpawnsDone = totalTimePassed / this.timeBeforeSpawningStars; 
                const currentBackgroundColor = new Color(
                    this.initialBackgroundColor.r * (1 - fractionTimeBeforeStarSpawnsDone),
                    this.initialBackgroundColor.g * (1 - fractionTimeBeforeStarSpawnsDone),
                    this.initialBackgroundColor.b * (1 - fractionTimeBeforeStarSpawnsDone),
                    1,
                );

                cachedBackgroundContext.fillStyle = currentBackgroundColor.toContextStyleString();
                cachedBackgroundContext.fillRect(0, 0, cachedBackgroundCanvas.width, cachedBackgroundCanvas.height);    
            }

            if (mainFractal.animationComplete && !mainFractalCompleteAndCachedToBackground) {
                mainFractal.draw(cachedBackgroundContext);
                mainFractalCompleteAndCachedToBackground = true;
                this.homeEventsService.emit(new EAMainFractalAnimationDone(this));
            }

            this.stars.filter(star => star.fadedIn && !star.drawCachedToBackground).forEach(star => {
                star.drawNonTwinkling(cachedBackgroundContext);
                star.drawCachedToBackground = true;
            });

            this.trees.filter(tree => tree.growthDone && !tree.drawCachedToBackground).forEach(tree => {
                tree.draw(cachedBackgroundContext);
                tree.drawCachedToBackground = true;
            });

            this.bushes.filter(bush => bush.growthDone && !bush.drawCachedToBackground).forEach(bush => {
                bush.draw(cachedBackgroundContext);
                bush.drawCachedToBackground = true;
            });

            context.drawImage(cachedBackgroundCanvas, 0, 0);

            if (!mainFractalCompleteAndCachedToBackground) {
                mainFractal.update(deltaTime);
                if (mainFractal.treeGrowthDone && !mainFractalGrowthFinishedEventEmitted) {
                    this.homeEventsService.emit(new EAMainFractalGrowthDone(this));
                    mainFractalGrowthFinishedEventEmitted = true;
                }
                mainFractal.draw(context);
            }

            this.stars.filter(star => !star.drawCachedToBackground || star.twinkling).forEach(star => {
                star.draw(context);
            });

            this.snowFlakes.forEach(snowFlake => {
                snowFlake.update(deltaTime, canvasHeight);
                snowFlake.drawCached(context, canvasHeight);
            });
            
            this.trees.filter(tree => !tree.growthDone).forEach(tree => tree.draw(context));

            this.bushes.filter(bush => !bush.growthDone).forEach(bush => bush.draw(context));

            this.snowFlakes = this.snowFlakes.filter(snowFlake => !snowFlake.removeThisFrame);

            if (this.continueAnimation) {
                window.requestAnimationFrame(doFrame);
            }
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

    public ngOnDestroy() : void {
        this.continueAnimation = false;
    }
}
