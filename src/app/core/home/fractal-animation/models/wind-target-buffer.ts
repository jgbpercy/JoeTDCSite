import * as lodash from 'lodash';

interface WindSpike {
  time: number;
  length: number;
  strength: number;
}

export class WindTargetBuffer {
  private windTargets: number[];

  private timeStep = 0.2;

  private bufferDuration = 10;
  private firstPass = true;

  private spikeLengthAverage = 0.8;
  private spikeLengthVariance = 0.3;
  private spikeGapAverage = 0.8;
  private spikeGapVariance = 0.6;
  private spikeStrengthAverage = Math.PI / 20;
  private spikeStrengthVariance = Math.PI / 40;

  private windPixelsPropagatedPerSecond = 2500;

  private timeElapsed = 0;

  constructor() {
    const spikes = new Array<WindSpike>();

    let currentTime = 0;
    while (currentTime <= this.bufferDuration) {
      const newSpike = {
        time:
          currentTime +
          this.spikeGapAverage +
          lodash.random(-this.spikeGapVariance, this.spikeGapVariance, true),
        length:
          this.spikeLengthAverage +
          lodash.random(-this.spikeLengthVariance, this.spikeLengthVariance, true),
        strength:
          this.spikeStrengthAverage +
          lodash.random(-this.spikeStrengthVariance, this.spikeStrengthVariance, true),
      };

      spikes.push(newSpike);

      currentTime = newSpike.time;
    }

    this.windTargets = new Array<number>(this.bufferDuration / this.timeStep);

    this.windTargets.fill(0);

    spikes.forEach(spike => {
      const startTime = spike.time - spike.length / 2;
      const startIndex = Math.round(startTime / this.timeStep);
      const endTime = spike.time + spike.length / 2;
      const endIndex = Math.round(endTime / this.timeStep) + 1;

      this.windTargets.fill(spike.strength, startIndex, endIndex);
    });
  }

  update(deltaTime: number): void {
    this.timeElapsed += deltaTime;

    if (this.timeElapsed > this.bufferDuration) {
      this.timeElapsed -= this.bufferDuration;
      this.firstPass = false;
    }
  }

  getCurrentWindTargetAtPosition(xPosition: number): number {
    const timeOffset = xPosition * (1 / this.windPixelsPropagatedPerSecond);

    let timeToUse = this.timeElapsed - timeOffset;
    if (timeToUse < 0) {
      if (this.firstPass) {
        return 0;
      } else {
        timeToUse = this.bufferDuration + timeToUse;
      }
    }

    const index = Math.floor(timeToUse / this.timeStep);

    return this.windTargets[index];
  }
}
