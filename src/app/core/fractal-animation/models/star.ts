import * as lodash from 'lodash';

import { Fractal } from './fractal';

export class Star extends Fractal {

    private timeToFadeIn = 0.7;
    private framesToFadeIn : number;
    private fadeInFramesElapsed = 0;

    private timeToTwinkle = 0.1;
    private framesToHalfTwinkle : number;
    private twinkleFramesElapsed = 0;

    private twinkleChancePerSecond = 0.1;
    private twinkleChancePerFrame : number;

    private normalAlpha : number;

    public constructor(
        canvasWidth : number,
        canvasHeight : number,
        targetFrameRate : number,
        mainFractalCenterX : number,
        mainFractalCenterY : number,
        mainFractalExclusionLength : number,
    ) {
        super();

        this.lineWidthChangePerFractalIteration = 0.1;
        this.startLineWidth = this.lineWidthChangePerFractalIteration * 3;

        this.framesToFadeIn = this.timeToFadeIn * targetFrameRate;
        this.framesToHalfTwinkle = this.timeToTwinkle * targetFrameRate;

        this.fadeInFramesElapsed = 0;

        this.initialLineLength = lodash.random(3, 7, false);

        this.alphaChangePerFractalIteration = 0;

        let foundPos = false;
        while (!foundPos) {

            this.yPos = lodash.random(0, 3 * canvasHeight / 4, true);
            this.xPos = lodash.random(0, canvasWidth, true);

            const xFromMainFractalCenter = this.xPos - mainFractalCenterX;
            const yFromMainFractalCenter = this.yPos - mainFractalCenterY;

            if (Math.pow(xFromMainFractalCenter, 2) + Math.pow(yFromMainFractalCenter, 2) 
                > Math.pow(mainFractalExclusionLength + this.initialLineLength * 2, 2)) {

                foundPos = true;

            }
        }

        this.fromAngle = 0

        this.color = {
            r: lodash.random(100, 120, false),
            g: 100,
            b: lodash.random(80, 100, false),
            a: 0,
        };

        this.normalAlpha = ((0.9 + 0.1 * lodash.random(0, 1, true)) * (canvasHeight - this.yPos) / canvasHeight);

        this.drawLinesAtAngles = [
            0,
            Math.PI / 2,
            Math.PI,
            3 * Math.PI / 2,
        ];

        this.twinkleChancePerFrame = 1 - Math.pow(1 - this.twinkleChancePerSecond, 1 / targetFrameRate);
    }

    public update() {

        if (this.fadeInFramesElapsed <= this.framesToFadeIn) {

            this.color.a = this.normalAlpha * this.fadeInFramesElapsed / this.framesToFadeIn;
            this.fadeInFramesElapsed += 1;

        } else if (this.twinkleFramesElapsed > 0) {

            if (this.twinkleFramesElapsed === this.framesToHalfTwinkle * 2) {
                this.color.a = this.normalAlpha;
                this.twinkleFramesElapsed = 0;
            } else {

                if (this.twinkleFramesElapsed <= this.framesToHalfTwinkle) {
                    this.color.a = this.normalAlpha
                        + (this.twinkleFramesElapsed / this.framesToHalfTwinkle) * (1 - this.normalAlpha);
                } else {
                    this.color.a = this.normalAlpha
                        + ((2 * this.framesToHalfTwinkle - this.twinkleFramesElapsed) / this.framesToHalfTwinkle) * (1 - this.normalAlpha);
                }

                this.twinkleFramesElapsed += 1;
            }
        } else {
            if (lodash.random(0, 1, true) < this.twinkleChancePerFrame) {
                this.twinkleFramesElapsed = 1;
            }
        }
    }
}
