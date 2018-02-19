import * as lodash from 'lodash';

import { Color } from './color';
import { Fractal } from './fractal';

export class Star extends Fractal {

    private timeToFadeIn = 0.6;
    private fadeInTimePassed = 0;
    public get fadedIn() : boolean {
        return this.fadeInTimePassed >= this.timeToFadeIn;
    }

    public drawCachedToBackground = false;

    private timeToTwinkle = 0.45;
    private twinkleTimePassed = 0;

    public twinkling = false;

    private twinkleChancePerSecond = 0.03;

    private normalAlpha : number;

    public constructor(
        canvasWidth : number,
        canvasHeight : number,
        mainFractalCenterX : number,
        mainFractalCenterY : number,
        mainFractalExclusionLength : number,
        maxY : number,
    ) {
        super();

        this.lineWidthChangePerFractalIteration = 0.1;
        this.initialLineWidth = this.lineWidthChangePerFractalIteration * 3;

        this.lineLength = lodash.random(3, 7, false);
        this.totalDrawLength = this.lineLength * 2.2;

        this.alphaChangePerFractalIteration = 0;

        let foundPos = false;
        while (!foundPos) {

            this.position.x = lodash.random(0, canvasWidth, true);
            this.position.y = lodash.random(0, maxY, true);

            const xFromMainFractalCenter = this.position.x - mainFractalCenterX;
            const yFromMainFractalCenter = this.position.y - mainFractalCenterY;

            if (Math.pow(xFromMainFractalCenter, 2) + Math.pow(yFromMainFractalCenter, 2) 
                > Math.pow(mainFractalExclusionLength + this.lineLength * 2, 2)) {

                foundPos = true;
            }
        }

        this.fromAngle = 0;

        this.color = new Color(
            lodash.random(150, 170, false),
            150,
            lodash.random(120, 140, false),
            0,
        );

        this.normalAlpha = ((0.9 + 0.1 * lodash.random(0, 1, true)) * (canvasHeight - this.position.y) / canvasHeight);

        this.drawLinesAtAngles = [
            0,
            Math.PI / 2,
            Math.PI,
            3 * Math.PI / 2,
        ];
    }

    /*Slightly hacky: stars can only twinkle when faded in, so they will be drawn to the background cache, so
      we can fade between zero alpha and whatever, and it wont make them disappear! :p
    */
    public update(deltaTime : number) {

        if (!this.fadedIn) {

            this.color.a = this.normalAlpha * this.fadeInTimePassed / this.timeToFadeIn;
            this.fadeInTimePassed += deltaTime;

        } else {

            if (this.twinkling) {
    
                if (this.twinkleTimePassed > this.timeToTwinkle) {
                    this.color.a = this.normalAlpha;
                    this.twinkling = false;
                    this.twinkleTimePassed = 0;
                } else {
    
                    if (this.twinkleTimePassed <= this.timeToTwinkle / 2) {
                        this.color.a = (this.twinkleTimePassed / (this.timeToTwinkle / 2));
                    } else {
                        this.color.a = (this.timeToTwinkle - this.twinkleTimePassed) / (this.timeToTwinkle / 2);
                    }
    
                    this.twinkleTimePassed += deltaTime;
                }
            } else {

                this.color.a = this.normalAlpha;

                const twinkleChangeInDeltaTime = 1 - Math.pow(1 - this.twinkleChancePerSecond, deltaTime);
    
                if (lodash.random(0, 1, true) < twinkleChangeInDeltaTime) {
                    this.twinkling = true;
                }
            }
        } 
    }

    public drawNonTwinkling(context : CanvasRenderingContext2D) {
        if (this.twinkling) {
            const currentAlpha = this.color.a;
            this.color.a = this.normalAlpha;
            this.draw(context);
            this.color.a = currentAlpha;
        } else {
            this.draw(context);
        }
    }
}
