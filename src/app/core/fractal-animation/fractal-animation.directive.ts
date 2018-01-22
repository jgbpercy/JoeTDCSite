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

@Directive({
    selector: '[jtdcFractalAnimation]'
})
export class FractalAnimationDirective implements OnInit {

    private canvas : HTMLCanvasElement;

    private currentTimeStamp = 0;

    private mainFractalInitialLineLength = 250;

    private timeBeforeSpawningSnowFlakesAndStars = 5;
    private timeBetweenSnowFlakeSpawns = 0.4;
    private timeBetweenStarSpawns = 0.01;

    private numberOfStars = 70;

    private snowFlakes : SnowFlake[] = new Array<SnowFlake>();
    private stars : Star[] = new Array<Star>();

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
        
        const mainFractalMaskCanvas = document.createElement('canvas');
        mainFractalMaskCanvas.width = this.canvas.width;
        mainFractalMaskCanvas.height = this.canvas.height;

        const mainFractalMaskContext = mainFractalMaskCanvas.getContext('2d');

        mainFractalMaskContext.fillStyle = 'black';
        mainFractalMaskContext.fillRect(0, 0, mainFractalMaskCanvas.width, mainFractalMaskCanvas.height);
        mainFractalMaskContext.globalCompositeOperation = 'xor';
        mainFractalMaskContext.beginPath();
        mainFractalMaskContext.moveTo(canvasWidth / 2, mainFractal.endOfAnimationCenterYCoordinate);
        mainFractalMaskContext.arc(
            canvasWidth / 2,
            mainFractal.endOfAnimationCenterYCoordinate,
            this.mainFractalInitialLineLength,
            0,
            Math.PI * 2,
        );
        mainFractalMaskContext.fill();

        context.lineCap = 'round';
        context.lineJoin = 'round';

        let totalTimePassed = 0;
        let timeSinceLastSnowFlakeSpawn = 0;
        let timeSinceLastStarSpawned = 0;
        let allStarsSpawned = false;

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

            if (!mainFractal.animationComplete) {

                context.fillRect(0, 0, canvasWidth, canvasHeight);

                mainFractal.update(deltaTime);
                mainFractal.drawInitialLine(context);
                if (mainFractal.initialLineDrawn) {
                    mainFractal.draw(context);
                }

            } else {
                context.drawImage(mainFractalMaskCanvas, 0, 0);
            }

            if (totalTimePassed >= this.timeBeforeSpawningSnowFlakesAndStars) {

                if (timeSinceLastSnowFlakeSpawn > this.timeBetweenSnowFlakeSpawns) {
                    this.snowFlakes.push(new SnowFlake(canvasWidth, canvasWidth / 2, this.mainFractalInitialLineLength));
                    timeSinceLastSnowFlakeSpawn = 0;
                } else {
                    timeSinceLastSnowFlakeSpawn += deltaTime;
                }

                if (!allStarsSpawned) {

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

                    if (this.stars.length >= this.numberOfStars) {
                        allStarsSpawned = true;
                    }
                }
            }

            this.snowFlakes.forEach(snowFlake => {
                snowFlake.update(deltaTime, canvasHeight);
                snowFlake.draw(context);
            });

            this.stars.forEach(star => {
                star.update(deltaTime);
                star.draw(context);
            });

            this.snowFlakes = this.snowFlakes.filter(snowFlake => !snowFlake.removeThisFrame);

            window.requestAnimationFrame(doFrame);
        };

        window.requestAnimationFrame(doFrame.bind(this));
    }
}
