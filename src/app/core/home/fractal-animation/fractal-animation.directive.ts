import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { EventArgs, EventsService, LoggerChannel, LoggerService } from 'core/services';
import * as lodash from 'lodash';

import {
    Bush,
    Color,
    FullTree,
    MainFractal,
    SnowFlake,
    SpawnInterval,
    Star,
    WindTargetBuffer,
} from './models';

const PerfLogChannel = LoggerChannel.FractalAnimationPerformanceCheck;

@Directive({
    selector: '[jtdcFractalAnimation]'
})
export class FractalAnimationDirective implements OnInit, OnDestroy {

    private canvas : HTMLCanvasElement;

    private continueAnimation = true;

    private currentTimeStamp = 0; 

    @Input() public canvasWidth : number;
    @Input() public canvasHeight : number;

    @Input() public mainFractalRadius : number;
    @Input() public mainFractalCenterY : number;

    private slowerFrameTargetThresholdWidth = 1200;
    private slowerFrameMaxFrameLength = 0.035;
    private fasterFrameMaxFrameLength = 0.02;
    private performanceCheckLoopFinalizationIterations = 8;

    private timeBeforeSpawningStars = 5;
    private timeBetweenStarSpawns = 0.01;
    private numberOfStarsPerPixel = 0.00025;

    private timeBeforeSpawingSnowFlakes = 7;
    private numberOfSnowFlakesToSpawnPerYPerSecond = 0.004;

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
        private eventsService : EventsService,
        private logger : LoggerService,
        private ngZone : NgZone,
    ) {
        this.canvas = this.element.nativeElement as HTMLCanvasElement;
    }

    public ngOnInit() : void {

        const context = this.canvas.getContext('2d');
                
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        
        const mainFractal = new MainFractal(
            this.canvasWidth,
            this.mainFractalRadius / 2,
            this.mainFractalCenterY,
        );
        
        const cachedBackgroundCanvas = document.createElement('canvas');
        cachedBackgroundCanvas.width = this.canvas.width;
        cachedBackgroundCanvas.height = this.canvas.height;

        const cachedBackgroundContext = cachedBackgroundCanvas.getContext('2d');

        context.lineCap = 'round';
        context.lineJoin = 'round';
        cachedBackgroundContext.lineCap = 'round';
        cachedBackgroundContext.lineJoin = 'round';

        let donePerformanceCheck = false;
        let doingPerformanceCheck = false;
        let finalizingPerformanceCheck = false;
        let finalizingPerformanceCheckCount = 0;
        let reinitedMainFractal = false;

        let totalTimePassed = 0;
        let mainFractalGrowthFinishedEventEmitted = false;
        let mainFractalCompleteAndCachedToBackground = false;
        let timeSinceLastSnowFlakeSpawn = 0;
        let timeSinceLastStarSpawned = 0;
        let allStarsSpawned = false;
        let timeSinceLastTreeSpawned = 0;
        let timeSinceLastBushSpawned = 0;

        const maxTreeHeight = this.canvasHeight / 5;
        const minTreeHeight = this.canvasHeight / 6;

        const pixelsForStarSpawns = 
            ((this.canvasHeight - maxTreeHeight) * this.canvasWidth)
            - Math.PI * Math.pow(this.mainFractalRadius, 2);
        const numberOfStarsToSpawn = Math.round(this.numberOfStarsPerPixel * pixelsForStarSpawns);

        const timeBetweenSnowFlakeSpawns = 1 / (this.numberOfSnowFlakesToSpawnPerYPerSecond * this.canvasWidth);

        const treeSpawnIntervals = this.getSpawnIntervals(
            this.canvasWidth, 
            this.numberOfTreesToSpawnPer1000X, 
            this.treeSpawnBufferZoneProportion,
        );

        const bushSpawnIntervals = this.getSpawnIntervals(
            this.canvasWidth,
            this.numberOfBushesToSpawnPer1000X,
            this.bushSpawnBufferZoneProportion,
        );

        const windTargetBuffer = new WindTargetBuffer();

        cachedBackgroundContext.fillStyle = this.initialBackgroundColor.toContextStyleString();
        cachedBackgroundContext.fillRect(0, 0, cachedBackgroundCanvas.width, cachedBackgroundCanvas.height);

        const doFrame = (timeStamp : number) => {

            // Capture deltaTime
            const deltaTime = (timeStamp - this.currentTimeStamp) / 1000;
            this.currentTimeStamp = timeStamp;

            // Clear initial slow frames
            if (!donePerformanceCheck && !doingPerformanceCheck && deltaTime > 0.035) {
                this.logger.log(PerfLogChannel, 'Pre perf check, clearing slow frames, deltaTime: ' + deltaTime);
                // this.ngZone.runOutsideAngular(() => requestAnimationFrame(doFrame));
                window.requestAnimationFrame(doFrame);
                return;
            }

            //Start performance check
            if (!doingPerformanceCheck && !donePerformanceCheck) {
                this.logger.log(PerfLogChannel, 'Starting checks, deltaTime: ' + deltaTime);
                doingPerformanceCheck = true;
                mainFractal.initForPerformanceChecks(this.initialBackgroundColor, this.canvasWidth, this.canvasHeight);
                mainFractal.draw(context);
                // this.ngZone.runOutsideAngular(() => requestAnimationFrame(doFrame));
                window.requestAnimationFrame(doFrame);
                return;
            }

            let maxFrameLength : number;
            if (this.canvasWidth > this.slowerFrameTargetThresholdWidth) {
                maxFrameLength = this.fasterFrameMaxFrameLength;
            } else {
                maxFrameLength = this.slowerFrameMaxFrameLength;
            }

            //Performance check
            if (doingPerformanceCheck) {
                if (finalizingPerformanceCheck) {
                    if (deltaTime > maxFrameLength) {
                        this.logger.log(PerfLogChannel, 'Got slow frame during finalization, deltaTime: ' + deltaTime);
                        finalizingPerformanceCheckCount = 0;
                        mainFractal.reduceFractalIterations(this.logger);
                    } else if (finalizingPerformanceCheckCount === this.performanceCheckLoopFinalizationIterations - 1) {
                        finalizingPerformanceCheck = false;
                        doingPerformanceCheck = false;
                        donePerformanceCheck = true;
                        this.logger.log(PerfLogChannel, 'Passed finalization and finished checks, deltaTime: ' + deltaTime);
                    } else {
                        this.logger.log(PerfLogChannel, 'Passed finalization iteration, deltaTime: ' + deltaTime);
                        finalizingPerformanceCheckCount += 1;
                    }
                } else {
                    if (deltaTime < maxFrameLength) {
                        this.logger.log(PerfLogChannel, 'Passed initial check iteration, deltaTime: ' + deltaTime);
                        mainFractal.increaseFractalIterations(this.logger);
                    } else {
                        this.logger.log(PerfLogChannel, 'Failed initial check iteration, deltaTime: ' + deltaTime);
                        mainFractal.reduceFractalIterations(this.logger);
                        finalizingPerformanceCheck = true;
                    }
                }

                context.fillStyle = this.initialBackgroundColor.toContextStyleString();
                context.fillRect(0, 0, cachedBackgroundCanvas.width, cachedBackgroundCanvas.height);
                mainFractal.update(deltaTime);
                mainFractal.draw(context);

            //Normal loop
            } else {

                if (!reinitedMainFractal) {
                    mainFractal.initAfterPerformanceChecks();
                    reinitedMainFractal = true;
                }

                totalTimePassed += deltaTime;

                if (totalTimePassed >= this.timeBeforeSpawningStars && !allStarsSpawned) {
    
                    if (timeSinceLastStarSpawned > this.timeBetweenStarSpawns) {
    
                        this.stars.push(new Star(
                            this.canvasWidth,
                            this.canvasHeight,
                            this.canvasWidth / 2,
                            mainFractal.endOfAnimationCenterYCoordinate,
                            this.mainFractalRadius,
                            this.canvasHeight - maxTreeHeight,
                        ));
    
                        timeSinceLastStarSpawned = 0;
                    } else {
                        timeSinceLastStarSpawned += deltaTime;
                    }
    
                    if (this.stars.length >= numberOfStarsToSpawn) {
                        allStarsSpawned = true;
                    }
                }
    
                if (totalTimePassed >= this.timeBeforeSpawingSnowFlakes) {
                    if (timeSinceLastSnowFlakeSpawn > timeBetweenSnowFlakeSpawns) {
                        this.snowFlakes.push(new SnowFlake(this.canvasWidth, this.canvasHeight));
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
    
                        this.trees.push(new FullTree(
                            randomInterval,
                            this.canvasHeight,
                            windTargetBuffer,
                            minTreeHeight / 4,
                            maxTreeHeight / 4,
                        ));
    
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
    
                        this.bushes.push(new Bush(randomInterval, this.canvasHeight));
    
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
                } else if (!mainFractalCompleteAndCachedToBackground) {
                    cachedBackgroundContext.fillStyle = (new Color(0, 0, 0, 1)).toContextStyleString();
                    cachedBackgroundContext.fillRect(0, 0, cachedBackgroundCanvas.width, cachedBackgroundCanvas.height);
                }
    
                if (mainFractal.animationComplete && !mainFractalCompleteAndCachedToBackground) {
                    mainFractal.draw(cachedBackgroundContext);
                    mainFractalCompleteAndCachedToBackground = true;
                    this.eventsService.emit('Main Fractal Animation Done', new EventArgs(this));
                }
    
                if (mainFractalCompleteAndCachedToBackground) {
                    this.stars.filter(star => star.fadedIn && !star.drawIsCachedToBackground).forEach(star => {
                        star.drawNonTwinkling(cachedBackgroundContext);
                        star.drawIsCachedToBackground = true;
                    });
                }
                
                this.trees.filter(tree => tree.growthDone && !tree.drawIsCachedToBackground).forEach(tree => {
                    tree.draw(cachedBackgroundContext);
                    tree.drawIsCachedToBackground = true;
                });
    
                this.bushes.filter(bush => bush.growthDone && !bush.drawIsCachedToBackground).forEach(bush => {
                    bush.draw(cachedBackgroundContext);
                    bush.drawIsCachedToBackground = true;
                });
    
                context.drawImage(cachedBackgroundCanvas, 0, 0);
    
                if (!mainFractalCompleteAndCachedToBackground) {
                    mainFractal.update(deltaTime);
                    if (mainFractal.treeGrowthDone && !mainFractalGrowthFinishedEventEmitted) {
                        this.eventsService.emit('Main Fractal Growth Done', new EventArgs(this));
                        mainFractalGrowthFinishedEventEmitted = true;
                    }
                    mainFractal.draw(context);
                }
    
                this.stars.filter(star => !star.drawIsCachedToBackground || star.twinkling).forEach(star => {
                    star.draw(context);
                });
    
                this.snowFlakes.forEach(snowFlake => {
                    snowFlake.update(deltaTime, this.canvasHeight);
                    snowFlake.drawCached(context, this.canvasHeight);
                });
                
                this.trees.filter(tree => !tree.growthDone).forEach(tree => tree.draw(context));
    
                this.bushes.filter(bush => !bush.growthDone).forEach(bush => bush.draw(context));
    
                this.snowFlakes = this.snowFlakes.filter(snowFlake => !snowFlake.removeThisFrame);
            }

            if (this.continueAnimation) {
                // this.ngZone.runOutsideAngular(() => requestAnimationFrame(doFrame));
                window.requestAnimationFrame(doFrame);
            }
        };
        
        // this.ngZone.runOutsideAngular(() => requestAnimationFrame(doFrame));
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
        } while ( currentIntervalBoundary + spawnIntervalWidth <= width);

        return spawnIntervals;
    }

    public ngOnDestroy() : void {
        this.continueAnimation = false;
    }
}
