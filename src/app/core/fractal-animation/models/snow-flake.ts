import * as lodash from 'lodash';

import { Fractal } from './fractal';

export class SnowFlake extends Fractal {

    public speed : number;

    public rotationSpeed : number;

    public constructor(
        canvasWidth : number,
        mainFractalCenterX : number,
        mainFractalExclusionLength : number,
    ) {
        super();

        this.lineLength = lodash.random(5, 16, false);

        this.totalDrawLength = this.lineLength * 2.2;

        this.speed = (40 + lodash.random(10, true)) * this.lineLength / 4;

        this.rotationSpeed = lodash.random(0.03, 0.1, true);
        const rotationDirection = lodash.random(0, 1, true) > 0.5 ? -1 : 1;
        this.rotationSpeed *= rotationDirection;

        this.alphaChangePerFractalIteration = 0.05;

        this.position.y = -this.lineLength * 2;

        let foundPos = false;
        while (!foundPos) {

            this.position.x = lodash.random(0, canvasWidth, true);
    
            const xFromMainFractalCenter = Math.abs(this.position.x - mainFractalCenterX);

            if (xFromMainFractalCenter > mainFractalExclusionLength + this.lineLength * 2)  {
                foundPos = true;
            }
        }

        this.fromAngle = 0;
        this.removeThisFrame = false;

        this.color = {
            r: lodash.random(110, 120, false),
            g: lodash.random(110, 120, false),
            b: lodash.random(140, 160, false),
            a: 0.5,
        };

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
    }

    public update(deltaTime : number, canvasHeight : number) {

        this.position.y += this.speed * deltaTime;

        this.fromAngle += this.rotationSpeed;

        if (this.fromAngle > 2 * Math.PI) {
            this.fromAngle -= 2 * Math.PI;
        } else if (this.fromAngle < 0) {
            this.fromAngle += 2 * Math.PI;
        }

        if (this.position.y > canvasHeight - 2 * this.lineLength) {
            this.removeThisFrame = true;
        }
    }
}