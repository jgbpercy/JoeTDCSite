import * as lodash from 'lodash';

import { Color } from './color';
import { Fractal } from './fractal';
import { SpawnInterval, Tree } from './tree';
import { Vector2 } from './vector-2';
import { WindTargetBuffer } from './wind-target-buffer';

export class FullTree extends Tree {

    private totalDrawLengthIncludingInitialLine : number;

    private normalDrawLinesAtAngles : number[];
    private normalFromAngle : number;
    private normalPosition : Vector2 = new Vector2();

    private currentWind = 0;

    private windLerpFactor = 1.7;
    private windLerpFactorVariance = 0.1;
    private windNoise = 0.04;

    //values for wind code, commented at time of writing
    // private canvasHeight : number;
    // private windTargetBuffer : WindTargetBuffer;

    public constructor(
        spawnInterval : SpawnInterval,
        canvasHeight : number,
        windTargetBuffer : WindTargetBuffer,
        minLineLength : number,
        maxLineLength : number,
    ) {
        super(spawnInterval, canvasHeight);

        //values for wind code, commented at time of writing
        // this.canvasHeight = canvasHeight;
        // this.windTargetBuffer = windTargetBuffer;

        this.lineLength = lodash.random(minLineLength, maxLineLength, false);

        this.totalDrawLengthIncludingInitialLine = 0;

        this.position.y -= this.lineLength * 2;

        this.normalPosition.x = this.position.x;
        this.normalPosition.y = this.position.y;

        this.normalFromAngle = this.fromAngle;

        this.color = new Color(
            lodash.random(110, 150, false),
            lodash.random(160, 200, false),
            lodash.random(90, 130, false),
            0.6,
        );

        this.initialLineWidth = this.lineWidthChangePerFractalIteration * 4;

        this.normalDrawLinesAtAngles = this.drawLinesAtAngles;
    }

    public update(deltaTime : number) : void {

        super.update(deltaTime);

        this.totalDrawLengthIncludingInitialLine = this.lineLength * 4 * this.growthEasing(this.fractionGrowthDone);
        this.totalDrawLength = this.totalDrawLengthIncludingInitialLine - (this.lineLength * 2);

        // const windNoise = lodash.random(-this.windNoise, this.windNoise, true);

        // const windTarget = windTargetBuffer.getCurrentWindTargetAtPosition(this.position.x) + windNoise;

        // const lerpFactor = this.windLerpFactor + lodash.random(-this.windLerpFactorVariance, this.windLerpFactorVariance, true);

        // this.currentWind = this.currentWind + (windTarget - this.currentWind) * this.windLerpFactor * deltaTime;

        // this.drawLinesAtAngles = this.normalDrawLinesAtAngles.map(angle => {
        //     return angle - this.currentWind;
        // });

        // this.fromAngle = this.normalFromAngle - (this.currentWind / 2);

        // this.position.x = this.normalPosition.x + (this.lineLength * 2) * Math.sin(this.fromAngle);
        // this.position.y = canvasHeight + (this.lineLength * 2) * Math.cos(this.fromAngle);
    }

    public draw(context : CanvasRenderingContext2D) : void {

        this.drawInitialLine(context);

        if (this.totalDrawLength > 0) {
            super.draw(context);
        }
    }

    private drawInitialLine(context : CanvasRenderingContext2D) : void {

        context.lineWidth = this.initialLineWidth + this.lineWidthChangePerFractalIteration;
        context.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;

        const initialLineLengthToDraw = this.totalDrawLengthIncludingInitialLine > this.lineLength * 2 ?
            this.lineLength * 2 : this.totalDrawLengthIncludingInitialLine;

        context.beginPath();
        context.moveTo(this.normalPosition.x, this.normalPosition.y + this.lineLength * 2);
        context.lineTo(this.position.x, this.normalPosition.y + this.lineLength * 2 - initialLineLengthToDraw);
        context.stroke();
    }
}
