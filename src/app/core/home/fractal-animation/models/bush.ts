import * as lodash from 'lodash';
import { Color } from './color';
import { SpawnInterval, Tree } from './tree';

export class Bush extends Tree {
  constructor(spawnInterval: SpawnInterval, canvasHeight: number) {
    super(spawnInterval, canvasHeight);

    this._lineLength = lodash.random(5, 24, false);

    this._color = new Color(
      lodash.random(150, 190, false),
      lodash.random(150, 190, false),
      lodash.random(80, 120, false),
      0.5,
    );

    this._initialLineWidth =
      this.lineLength > 11
        ? this.lineWidthChangePerFractalIteration * 3
        : this.lineWidthChangePerFractalIteration * 2;
  }

  update(deltaTime: number): void {
    super.update(deltaTime);

    this._totalDrawLength = this.lineLength * 2 * this.growthEasing(this.fractionGrowthDone);
  }
}
