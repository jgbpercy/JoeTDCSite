import * as lodash from 'lodash';

import { Fractal } from './fractal';
import { Vector2 } from './vector-2';
import { WindTargetBuffer } from './wind-target-buffer';

export class SpawnInterval {
    public min : number;
    public max : number;
}

export class Tree extends Fractal {

    private normalDrawLinesAtAngles : number[];
    private normalFromAngle : number;
    private normalPosition : Vector2 = new Vector2();

    private currentWind = 0;
    
    private windLerpFactor = 1.7;
    private windLerpFactorVariance = 0.1;
    private windNoise = 0.04;

    public constructor(
        spawnInterval : SpawnInterval,
        canvasHeight : number,
        bush : boolean, //Temp!
    ) {
        super();

        if (!bush) {
            this.lineLength = lodash.random(40, 60, false);
        } else {
            this.lineLength = lodash.random(5, 24, false);
        }

        this.totalDrawLength = this.lineLength * 2.2;

        this.position.y = canvasHeight;
        if (!bush) {
            this.position.y -= this.lineLength * 2;
        }
        this.position.x = lodash.random(spawnInterval.min, spawnInterval.max, true);

        this.normalPosition.x = this.position.x;
        this.normalPosition.y = this.normalPosition.y;
        
        this.alphaChangePerFractalIteration = 0.05;

        this.fromAngle = Math.PI;
        this.normalFromAngle = this.fromAngle;

        this.removeThisFrame = false;

        if (!bush) {
            this.color = {
                r: lodash.random(110, 150, false),
                g: lodash.random(160, 200, false),
                b: lodash.random(90, 130, false),
                a: 0.6,
            };
        } else {
            this.color = {
                r: lodash.random(150, 190, false),
                g: lodash.random(150, 190, false),
                b: lodash.random(80, 120, false),
                a: 0.5,
            };
        }

        this.lineWidthChangePerFractalIteration  = 0.5;
        
        if (!bush) {
            this.initialLineWidth = this.lineWidthChangePerFractalIteration * 4;
        } else {
            this.initialLineWidth = this.lineLength > 11 ? 
                this.lineWidthChangePerFractalIteration * 3 : this.lineWidthChangePerFractalIteration * 2;
        }
        
        const branches = lodash.random(3, 5, false);

        if (branches === 3) {
            const angle1 = lodash.random(-5 * Math.PI / 16, -2 * Math.PI / 16, true);
            const angle2 = lodash.random(-2 * Math.PI / 16, 2 * Math.PI / 16, true);
            const angle3 = lodash.random(2 * Math.PI / 16, 5 * Math.PI / 16, true);
            this.normalDrawLinesAtAngles = [
                angle1,
                angle2,
                angle3,
            ];
        } else if (branches === 4) {
            const angle1 = lodash.random(-6 * Math.PI / 16, -3 * Math.PI / 16, true);
            const angle2 = lodash.random(-3 * Math.PI / 16, 0 * Math.PI / 16, true);
            const angle3 = lodash.random(0 * Math.PI / 16, 3 * Math.PI / 16, true);
            const angle4 = lodash.random(3 * Math.PI / 16, 6 * Math.PI / 16, true);
            this.normalDrawLinesAtAngles = [
                angle1,
                angle2,
                angle3,
                angle4,
            ];
        } else if (branches === 5) {
            const angle1 = lodash.random(-7 * Math.PI / 16, -4 * Math.PI / 16, true);
            const angle2 = lodash.random(-4 * Math.PI / 16, -1 * Math.PI / 16, true);
            const angle3 = lodash.random(-1 * Math.PI / 16, 1 * Math.PI / 16, true);
            const angle4 = lodash.random(1 * Math.PI / 16, 4 * Math.PI / 16, true);
            const angle5 = lodash.random(4 * Math.PI / 16, 7 * Math.PI / 16, true);
            this.normalDrawLinesAtAngles = [
                angle1,
                angle2,
                angle3,
                angle4,
                angle5,
            ];
        }

        this.drawLinesAtAngles = this.normalDrawLinesAtAngles;
    }

    public update(deltaTime : number, windTargetBuffer : WindTargetBuffer, canvasHeight : number) {

        const windNoise = lodash.random(-this.windNoise, this.windNoise, true);

        const windTarget = windTargetBuffer.getCurrentWindTargetAtPosition(this.position.x) + windNoise;

        const lerpFactor = this.windLerpFactor + lodash.random(-this.windLerpFactorVariance, this.windLerpFactorVariance, true);

        this.currentWind = this.currentWind + (windTarget - this.currentWind) * this.windLerpFactor * deltaTime;

        this.drawLinesAtAngles = this.normalDrawLinesAtAngles.map(angle => {
            return angle - this.currentWind;
        });

        this.fromAngle = this.normalFromAngle - (this.currentWind / 2);

        this.position.x = this.normalPosition.x + (this.lineLength * 2) * Math.sin(this.fromAngle);
        this.position.y = canvasHeight + (this.lineLength * 2) * Math.cos(this.fromAngle);

    }

    public drawInitialLine(context : CanvasRenderingContext2D, canvasHeight : number) {

        context.lineWidth = this.initialLineWidth + this.lineWidthChangePerFractalIteration;
        context.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;

        context.beginPath();
        context.moveTo(this.normalPosition.x, canvasHeight);
        context.lineTo(this.position.x, this.position.y);
        context.stroke();
    }
}