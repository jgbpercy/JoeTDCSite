import * as lodash from 'lodash';

import { Color } from './color';
import { SpawnInterval, Tree } from './tree';

export class Bush extends Tree {

    public constructor(
        spawnInterval : SpawnInterval,
        canvasHeight : number,
    ) {
        super(spawnInterval, canvasHeight);

        this.lineLength = lodash.random(5, 24, false);

        this.color = new Color(
            lodash.random(150, 190, false),
            lodash.random(150, 190, false),
            lodash.random(80, 120, false),
            0.5,
        );

        this.initialLineWidth = this.lineLength > 11 ? 
            this.lineWidthChangePerFractalIteration * 3 : this.lineWidthChangePerFractalIteration * 2;
    }

    public update(deltaTime : number) : void  {

        super.update(deltaTime);

        this.totalDrawLength = this.lineLength * 2 * this.growthEasing(this.fractionGrowthDone);
    }
}
