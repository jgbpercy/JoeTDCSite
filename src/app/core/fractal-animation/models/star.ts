import * as lodash from 'lodash';

import { Fractal } from './fractal';

export class Star extends Fractal {

    private timeToFadeIn = 0.7;
    private fadeInTimePassed = 0;

    private timeToTwinkle = 0.3;
    private twinkleTimePassed = 0;

    private twinkling = false;

    private twinkleChancePerSecond = 0.1;

    private normalAlpha : number;

    public constructor(
        canvasWidth : number,
        canvasHeight : number,
        mainFractalCenterX : number,
        mainFractalCenterY : number,
        mainFractalExclusionLength : number,
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
            this.position.y = lodash.random(0, 3 * canvasHeight / 4, true);

            const xFromMainFractalCenter = this.position.x - mainFractalCenterX;
            const yFromMainFractalCenter = this.position.y - mainFractalCenterY;

            if (Math.pow(xFromMainFractalCenter, 2) + Math.pow(yFromMainFractalCenter, 2) 
                > Math.pow(mainFractalExclusionLength + this.lineLength * 2, 2)) {

                foundPos = true;
            }
        }

        this.fromAngle = 0;

        this.color = {
            r: lodash.random(100, 120, false),
            g: 100,
            b: lodash.random(80, 100, false),
            a: 0,
        };

        this.normalAlpha = ((0.9 + 0.1 * lodash.random(0, 1, true)) * (canvasHeight - this.position.y) / canvasHeight);

        this.drawLinesAtAngles = [
            0,
            Math.PI / 2,
            Math.PI,
            3 * Math.PI / 2,
        ];
    }

    public update(deltaTime : number) {

        if (this.fadeInTimePassed <= this.timeToFadeIn) {

            this.color.a = this.normalAlpha * this.fadeInTimePassed / this.timeToFadeIn;
            this.fadeInTimePassed += deltaTime;

        } else if (this.twinkling) {

            if (this.twinkleTimePassed > this.timeToTwinkle) {
                this.color.a = this.normalAlpha;
                this.twinkling = false;
            } else {

                if (this.twinkleTimePassed <= this.timeToTwinkle / 2) {
                    this.color.a = this.normalAlpha
                        + (this.twinkleTimePassed / (this.timeToTwinkle / 2)) * (1 - this.normalAlpha);
                } else {
                    this.color.a = this.normalAlpha
                        + ((this.timeToTwinkle - this.twinkleTimePassed) / (this.timeToTwinkle / 2)) * (1 - this.normalAlpha);
                }

                this.twinkleTimePassed += deltaTime;
            }
        } else {
            const twinkleChangeInDeltaTime = 1 - Math.pow(1 - this.twinkleChancePerSecond, deltaTime);

            if (lodash.random(0, 1, true) < twinkleChangeInDeltaTime) {
                this.twinkling = true;
            }
        }
    }
}
