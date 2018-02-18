import * as bezier from 'bezier-easing';
import * as lodash from 'lodash';

import { Fractal } from './fractal';
import { Vector2 } from './vector-2';
import { WindTargetBuffer } from './wind-target-buffer';

export class SpawnInterval {
    public min : number;
    public max : number;
}

export class Tree extends Fractal {

    private timeForGrowth : number;
    private timeGrowing = 0;
    protected fractionGrowthDone = 0;
    public growthDone = false;

    public drawCachedToBackground = false;

    protected growthEasing : (fraction : number) => number;
    
    public constructor(
        spawnInterval : SpawnInterval,
        canvasHeight : number,
    ) {
        super();

        this.totalDrawLength = 0;

        this.position.y = canvasHeight;

        this.position.x = lodash.random(spawnInterval.min, spawnInterval.max, true);

        this.alphaChangePerFractalIteration = 0.05;

        this.lineWidthChangePerFractalIteration  = 0.5;

        this.fromAngle = Math.PI;

        this.removeThisFrame = false;
        
        const branches = lodash.random(3, 5, false);

        if (branches === 3) {
            this.drawLinesAtAngles = [
                lodash.random(-5 * Math.PI / 16, -2 * Math.PI / 16, true),
                lodash.random(-2 * Math.PI / 16, 2 * Math.PI / 16, true),
                lodash.random(2 * Math.PI / 16, 5 * Math.PI / 16, true),
            ];
        } else if (branches === 4) {
            this.drawLinesAtAngles = [
                lodash.random(-6 * Math.PI / 16, -3 * Math.PI / 16, true),
                lodash.random(-3 * Math.PI / 16, 0 * Math.PI / 16, true),
                lodash.random(0 * Math.PI / 16, 3 * Math.PI / 16, true),
                lodash.random(3 * Math.PI / 16, 6 * Math.PI / 16, true),
            ];
        } else if (branches === 5) {
            this.drawLinesAtAngles = [
                lodash.random(-7 * Math.PI / 16, -4 * Math.PI / 16, true),
                lodash.random(-4 * Math.PI / 16, -1 * Math.PI / 16, true),
                lodash.random(-1 * Math.PI / 16, 1 * Math.PI / 16, true),
                lodash.random(1 * Math.PI / 16, 4 * Math.PI / 16, true),
                lodash.random(4 * Math.PI / 16, 7 * Math.PI / 16, true),
            ];
        }

        this.timeForGrowth = lodash.random(1.5, 2.5, true);

        this.growthEasing = bezier(0.25, 0.75, 0.55, 1);
    }

    public update(deltaTime : number) : void {

        if (!this.growthDone) {

            //TODO: factor this with stuff in mainFractal?
            this.timeGrowing += deltaTime;
    
            const unboundedFractionGrowthDone = this.timeGrowing / this.timeForGrowth;
            this.fractionGrowthDone = unboundedFractionGrowthDone > 1 ? 1 : unboundedFractionGrowthDone;
            this.growthDone = this.fractionGrowthDone === 1;
        }        
    }
}
