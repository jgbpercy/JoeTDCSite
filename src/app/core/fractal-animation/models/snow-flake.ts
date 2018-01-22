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

        this.initialLineLength = lodash.random(4, 15, false);

        this.speed = (1.2 + lodash.random(0.3)) * this.initialLineLength / 4;

        this.rotationSpeed = lodash.random(0.03, 0.1, true);
        const rotationDirection = lodash.random(0, 1, true) > 0.5 ? -1 : 1;
        this.rotationSpeed *= rotationDirection;

        this.alphaChangePerFractalIteration = 0.05;

        this.yPos = -this.initialLineLength * 2;

        let foundPos = false;
        while (!foundPos) {

            this.xPos = lodash.random(0, canvasWidth, true);
    
            const xFromMainFractalCenter = Math.abs(this.xPos - mainFractalCenterX);

            if (xFromMainFractalCenter > mainFractalExclusionLength + this.initialLineLength * 2)  {
                foundPos = true;
            }
        }

        this.fromAngle = 0;
        this.removeThisFrame = false;

        this.color = {
            r: lodash.random(120, 130, false),
            g: lodash.random(120, 130, false),
            b: lodash.random(130, 155, false),
            a: 0.5,
        };

        let branches = lodash.random(4, 6, false);
        branches = branches === 4 ? 3 : branches;

        this.lineWidthChangePerFractalIteration = 0.5;

        //TODO: this can be factored with stuff below
        if (branches === 3) {

            this.startLineWidth = this.initialLineLength < 8 ? 1 : 2;

            this.drawLinesAtAngles = [
                -2 * Math.PI / 3,
                0,
                2 * Math.PI / 3,
            ];

        } else if (branches === 5) {

            this.startLineWidth = this.initialLineLength < 8 ? 1 : 1.5;

            this.drawLinesAtAngles = [
                -4 * Math.PI / 5,
                -2 * Math.PI / 5,
                0,
                2 * Math.PI / 5,
                4 * Math.PI / 5,
            ];

        } else if (branches === 6) {

            this.startLineWidth = this.initialLineLength < 8 ? 1 : 1.5;

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

    public move() {
        this.yPos += this.speed;
        this.fromAngle += this.rotationSpeed;
        if (this.fromAngle > 2 * Math.PI) {
            this.fromAngle -= 2 * Math.PI;
        } else if (this.fromAngle < 0) {
            this.fromAngle += 2 * Math.PI;
        }
    }
}
