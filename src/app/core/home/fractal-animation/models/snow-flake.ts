import * as lodash from 'lodash';

import { Color } from './color';
import { Fractal } from './fractal';
import { Vector2 } from './vector-2';

export class SnowFlake extends Fractal {

    public speed : number;

    public rotationSpeed : number;

    private startFadeOutAtY : number;
    private endFadeOutAtY : number;

    private cachedImageCanvas : HTMLCanvasElement;

    public constructor(
        canvasWidth : number,
        canvasHeight : number,
    ) {
        super();

        this.lineLength = lodash.random(5, 16, false);

        this.totalDrawLength = this.lineLength * 2.2;

        this.speed = (28 + lodash.random(8, true)) * this.lineLength / 4;

        this.rotationSpeed = lodash.random(1, 3, true);
        const rotationDirection = lodash.random(0, 1, true) > 0.5 ? -1 : 1;
        this.rotationSpeed *= rotationDirection;

        this.alphaChangePerFractalIteration = 0.05;

        this.position.y = -this.lineLength * 2;

        this.position.x = lodash.random(0, canvasWidth, true);
    
        this.fromAngle = 0;
        this.removeThisFrame = false;

        this.color = new Color(
            lodash.random(110, 120, false),
            lodash.random(110, 120, false),
            lodash.random(140, 160, false),
            0.5,
        );

        let branches = lodash.random(4, 6, false);
        branches = branches === 4 ? 3 : branches;

        this.lineWidthChangePerFractalIteration = 0.5;

        if (branches === 3) {

            this.initialLineWidth = this.lineLength < 9 ? 1.5 : 2;

            this.drawLinesAtAngles = [
                -2 * Math.PI / 3,
                0,
                2 * Math.PI / 3,
            ];

        } else if (branches === 5) {

            this.initialLineWidth = this.lineLength < 9 ? 1 : 1.5;

            this.drawLinesAtAngles = [
                -4 * Math.PI / 5,
                -2 * Math.PI / 5,
                0,
                2 * Math.PI / 5,
                4 * Math.PI / 5,
            ];

        } else if (branches === 6) {

            this.initialLineWidth = this.lineLength < 10 ? 1 : 1.5;

            this.drawLinesAtAngles = [
                -2 * Math.PI / 3,
                -1 * Math.PI / 3,
                0,
                1 * Math.PI / 3,
                2 * Math.PI / 3,
                Math.PI,
            ];
        }

        this.cachedImageCanvas = document.createElement('canvas');

        this.cachedImageCanvas.width = this.lineLength * 4;
        this.cachedImageCanvas.height = this.cachedImageCanvas.width;

        const cachedImageContext = this.cachedImageCanvas.getContext('2d');

        const realPosition : Vector2 = {
            x: this.position.x,
            y: this.position.y,
        };

        this.position.x = this.lineLength * 2;
        this.position.y = this.position.x;

        this.draw(cachedImageContext);

        this.position = {
            x: realPosition.x,
            y: realPosition.y,
        };

        this.startFadeOutAtY = canvasHeight / 2;

        this.endFadeOutAtY = canvasHeight * 3 / 4;
    }

    public update(deltaTime : number, canvasHeight : number) {

        this.position.y += this.speed * deltaTime;

        this.fromAngle += this.rotationSpeed * deltaTime;

        if (this.fromAngle > 2 * Math.PI) {
            this.fromAngle -= 2 * Math.PI;
        } else if (this.fromAngle < 0) {
            this.fromAngle += 2 * Math.PI;
        }

        if (this.position.y >= this.endFadeOutAtY) {
            this.removeThisFrame = true;
        }
    }

    public drawCached(context : CanvasRenderingContext2D, canvasHeight : number) {

        context.save();

        context.translate(this.position.x, this.position.y);
        context.rotate(this.fromAngle);
        context.globalAlpha = 1 - (this.position.y - this.startFadeOutAtY) / (this.endFadeOutAtY - this.startFadeOutAtY);
        if (this.removeThisFrame) { context.globalAlpha = 0; }
        context.drawImage(this.cachedImageCanvas, -this.lineLength * 2, -this.lineLength * 2);

        context.restore();
    }
}
