import * as bezier from 'bezier-easing';
import * as lodash from 'lodash';

import { Color } from './color';
import { Fractal } from './fractal';
import { Vector2 } from './vector-2';

export class MainFractal extends Fractal {

    public animationComplete = false;
    public initialLineDrawn = false;
    
    public initialLineStart : Vector2 = new Vector2();

    public endOfAnimationCenterYCoordinate = 450;

    private timeForGrowth = 5;
    private timeForRotation = 4;
    private totalTimeToCompleteAnimation : number;
    private timeBeforeInitialLineStartsRetracting = 2;
    private timeForInitialLineRetraction : number;

    private startAngleChangePerFractalIteration : number;
    private endAngleChangePerFractalIteration : number;

    private totalTimePassed = 0;
    private rotationTimePassed = 0;
    private initialLineRetractionTimePassed = 0;
    public treeGrowthDone = false;

    private drawLengthIncludingInitialLine = 0;

    private initialLineFullLengthXEnd : number;

    private getAnglesAtWhichToDrawLines : (angleChangePerFractalIteration : number) => number[];

    private rotationEasing : (fraction : number) => number;

    private growthEasing : (fraction : number) => number;

    public constructor(
        canvasWidth : number,
        lineLength : number,
    ) {

        super();

        this.totalTimeToCompleteAnimation = this.timeForGrowth + this.timeForRotation;
        this.timeForInitialLineRetraction = this.totalTimeToCompleteAnimation - this.timeBeforeInitialLineStartsRetracting;

        this.lineLength = lineLength;
        this.totalDrawLength = 0;

        this.initialLineFullLengthXEnd = canvasWidth * 0.5;

        this.lineWidthChangePerFractalIteration = 0.4;

        this.color = new Color(115, 60, 45, 0.9);

        this.alphaChangePerFractalIteration = 0.1;

        this.endAngleChangePerFractalIteration = 2 * Math.PI / lodash.random(3, 7, false);
        
        this.growthEasing = bezier(0.25, 0.75, 0.55, 1);
        this.rotationEasing = bezier(0.8, 0.05, 0.5, 0.95);

        const branches = lodash.random(3, 6, false);

        if (branches === 3) {

            this.initialLineWidth = this.lineWidthChangePerFractalIteration * 7;

            this.startAngleChangePerFractalIteration = Math.PI / lodash.random(4.5, 7.5, true);
            this.getAnglesAtWhichToDrawLines = angleChangePerFractalIteration => [
                -angleChangePerFractalIteration,
                0,
                angleChangePerFractalIteration,
            ];

        } else if (branches === 4) {

            this.initialLineWidth = this.lineWidthChangePerFractalIteration * 6;

            this.startAngleChangePerFractalIteration = Math.PI / lodash.random(5, 7.5, true);
            this.getAnglesAtWhichToDrawLines = angleChangePerFractalIteration => [
                -1.5 * angleChangePerFractalIteration,
                -0.5 * angleChangePerFractalIteration,
                0.5 * angleChangePerFractalIteration,
                1.5 * angleChangePerFractalIteration,
            ];

        } else if (branches === 5) {

            this.initialLineWidth = this.lineWidthChangePerFractalIteration * 5;

            this.startAngleChangePerFractalIteration = Math.PI / lodash.random(5.5, 8, true);
            this.getAnglesAtWhichToDrawLines = angleChangePerFractalIteration => [
                -2 * angleChangePerFractalIteration,
                -angleChangePerFractalIteration,
                0,
                angleChangePerFractalIteration,
                2 * angleChangePerFractalIteration
            ];

        } else if (branches === 6) {

            this.initialLineWidth = this.lineWidthChangePerFractalIteration * 5;

            this.startAngleChangePerFractalIteration = Math.PI / lodash.random(6, 8, true);
            this.getAnglesAtWhichToDrawLines = angleChangePerFractalIteration => [
                -2.5 * angleChangePerFractalIteration,
                -1.5 * angleChangePerFractalIteration,
                -0.5 * angleChangePerFractalIteration,
                0.5 * angleChangePerFractalIteration,
                1.5 * angleChangePerFractalIteration,
                2.5 * angleChangePerFractalIteration
            ];

        } else {
            console.error('mainTreeBranches was an unexpected number: ' + branches);
        }
    }

    public update(deltaTime : number) : void {

        this.totalTimePassed += deltaTime;

        const unboundedFractionTreeGrowthDone = this.totalTimePassed / this.timeForGrowth;
        const fractionTreeGrowthDone = unboundedFractionTreeGrowthDone > 1 ? 1 : unboundedFractionTreeGrowthDone;
        this.treeGrowthDone = fractionTreeGrowthDone === 1;

        if (this.treeGrowthDone) {
            this.rotationTimePassed += deltaTime;
        }

        this.drawLengthIncludingInitialLine = this.lineLength * 4 * this.growthEasing(fractionTreeGrowthDone);
        this.totalDrawLength = this.drawLengthIncludingInitialLine - (this.lineLength * 2);

        const unboundedFractionRotationDone = this.rotationTimePassed / this.timeForRotation;
        const fractionRotationDone = unboundedFractionRotationDone < 0 ? 0 :
            (unboundedFractionRotationDone > 1 ? 1 : unboundedFractionRotationDone);
        this.animationComplete = fractionRotationDone === 1;

        if (this.totalTimePassed > this.timeBeforeInitialLineStartsRetracting) {
            this.initialLineRetractionTimePassed += deltaTime;
        }

        const unboundedFractionInitialLineRetractionDone = this.initialLineRetractionTimePassed / this.timeForInitialLineRetraction;
        const fractionInitialLineRetractionDone = unboundedFractionInitialLineRetractionDone < 0 ? 0 :
            (unboundedFractionInitialLineRetractionDone > 1 ? 1 : unboundedFractionInitialLineRetractionDone);

        const angleChangePerFractalIteration = this.startAngleChangePerFractalIteration
            + (this.endAngleChangePerFractalIteration - this.startAngleChangePerFractalIteration)
            * this.rotationEasing(fractionRotationDone);

        this.fromAngle = this.rotationEasing(fractionRotationDone) * -Math.PI;

        this.initialLineDrawn = this.drawLengthIncludingInitialLine > this.lineLength * 2;
        const initialLineLengthToDraw = this.initialLineDrawn ? this.lineLength * 2 : this.drawLengthIncludingInitialLine;

        let initialLineFullLengthYEnd : number;

        if (!this.treeGrowthDone) {
            initialLineFullLengthYEnd = this.lineLength * 2;
        } else {
            initialLineFullLengthYEnd = this.lineLength * 2 + 
                this.rotationEasing(fractionRotationDone) * (this.endOfAnimationCenterYCoordinate - this.lineLength * 2);
        }

        const retractedLength = this.lineLength * 2 * this.rotationEasing(1 - fractionInitialLineRetractionDone);

        this.initialLineStart.x = this.initialLineFullLengthXEnd - retractedLength * Math.sin(this.fromAngle);
        this.initialLineStart.y = initialLineFullLengthYEnd - retractedLength * Math.cos(this.fromAngle);

        if (!this.initialLineDrawn) {
            this.position.x = this.initialLineStart.x + initialLineLengthToDraw * Math.sin(this.fromAngle);
            this.position.y = this.initialLineStart.y + initialLineLengthToDraw * Math.cos(this.fromAngle);
        } else {
            this.position.x = this.initialLineFullLengthXEnd;
            this.position.y = initialLineFullLengthYEnd;
        }

        this.drawLinesAtAngles = this.getAnglesAtWhichToDrawLines(angleChangePerFractalIteration);
    }

    public draw(context : CanvasRenderingContext2D) {

        this.drawInitialLine(context);

        if (this.totalDrawLength > 0) {
            super.draw(context);
        }
    }

    private drawInitialLine(context : CanvasRenderingContext2D) : void {

        context.lineWidth = this.initialLineWidth + this.lineWidthChangePerFractalIteration;
        context.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;

        context.beginPath();
        context.moveTo(this.initialLineStart.x, this.initialLineStart.y);
        context.lineTo(this.position.x, this.position.y);
        context.stroke();
    }
}
