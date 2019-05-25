import * as bezier from 'bezier-easing';
import { LoggerChannel, LoggerService } from 'core/services';
import * as lodash from 'lodash';
import { getDefined } from 'shared/utils';
import { Color } from './color';
import { Fractal } from './fractal';
import { Vector2 } from './vector-2';

export class MainFractal extends Fractal {
  animationComplete = false;
  initialLineDrawn = false;

  initialLineStart: Vector2 = {
    x: 0,
    y: 0,
  };

  endOfAnimationCenterYCoordinate: number;

  private timeForGrowth = 5;
  private timeForRotation = 4;
  private totalTimeToCompleteAnimation: number;
  private timeBeforeInitialLineStartsRetracting = 2;
  private timeForInitialLineRetraction: number;

  private _startAngleChangePerFractalIteration?: number;
  private get startAngleChangePerFractalIteration(): number {
    return getDefined(this._startAngleChangePerFractalIteration);
  }
  private endAngleChangePerFractalIteration: number;

  private totalTimePassed = 0;
  private rotationTimePassed = 0;
  private initialLineRetractionTimePassed = 0;
  treeGrowthDone = false;

  private drawLengthIncludingInitialLine = 0;

  private initialLineFullLengthXEnd: number;

  private _getAnglesAtWhichToDrawLines?: (angleChangePerFractalIteration: number) => number[];
  private get getAnglesAtWhichToDrawLines(): (angleChangePerFractalIteration: number) => number[] {
    return getDefined(this._getAnglesAtWhichToDrawLines);
  }

  private rotationEasing: (fraction: number) => number;

  private growthEasing: (fraction: number) => number;

  constructor(canvasWidth: number, lineLength: number, endCenterY: number) {
    super();

    this.totalTimeToCompleteAnimation = this.timeForGrowth + this.timeForRotation;
    this.timeForInitialLineRetraction =
      this.totalTimeToCompleteAnimation - this.timeBeforeInitialLineStartsRetracting;

    this._lineLength = lineLength;

    this.initialLineFullLengthXEnd = canvasWidth * 0.5;

    this.endOfAnimationCenterYCoordinate = endCenterY;

    this._lineWidthChangePerFractalIteration = 0.4;

    this._alphaChangePerFractalIteration = 0;

    let endAngleChangesDivisor: number;

    this.endAngleChangePerFractalIteration = (2 * Math.PI) / 5; // lodash.random(3, 7, false);

    this.growthEasing = bezier(0.25, 0.75, 0.55, 1);
    this.rotationEasing = bezier(0.8, 0.05, 0.5, 0.95);

    const branches = lodash.random(3, 6, false);

    if (branches === 3) {
      endAngleChangesDivisor = 3;

      this._initialLineWidth = this.lineWidthChangePerFractalIteration * 4;

      this._startAngleChangePerFractalIteration = Math.PI / lodash.random(4.5, 7.5, true);
      this._getAnglesAtWhichToDrawLines = angleChangePerFractalIteration => [
        -angleChangePerFractalIteration,
        0,
        angleChangePerFractalIteration,
      ];
    } else if (branches === 4) {
      endAngleChangesDivisor = lodash.random(3, 4, false);

      this._initialLineWidth = this.lineWidthChangePerFractalIteration * 4;

      this._startAngleChangePerFractalIteration = Math.PI / lodash.random(5, 7.5, true);
      this._getAnglesAtWhichToDrawLines = angleChangePerFractalIteration => [
        -1.5 * angleChangePerFractalIteration,
        -0.5 * angleChangePerFractalIteration,
        0.5 * angleChangePerFractalIteration,
        1.5 * angleChangePerFractalIteration,
      ];
    } else if (branches === 5) {
      endAngleChangesDivisor = lodash.random(3, 5, false);

      this._initialLineWidth = this.lineWidthChangePerFractalIteration * 3;

      this._startAngleChangePerFractalIteration = Math.PI / lodash.random(5.5, 8, true);
      this._getAnglesAtWhichToDrawLines = angleChangePerFractalIteration => [
        -2 * angleChangePerFractalIteration,
        -angleChangePerFractalIteration,
        0,
        angleChangePerFractalIteration,
        2 * angleChangePerFractalIteration,
      ];
    } else if (branches === 6) {
      endAngleChangesDivisor = lodash.random(3, 6, false);

      this._initialLineWidth = this.lineWidthChangePerFractalIteration * 3;

      this._startAngleChangePerFractalIteration = Math.PI / lodash.random(6, 8, true);
      this._getAnglesAtWhichToDrawLines = angleChangePerFractalIteration => [
        -2.5 * angleChangePerFractalIteration,
        -1.5 * angleChangePerFractalIteration,
        -0.5 * angleChangePerFractalIteration,
        0.5 * angleChangePerFractalIteration,
        1.5 * angleChangePerFractalIteration,
        2.5 * angleChangePerFractalIteration,
      ];
    } else {
      throw Error('mainTreeBranches was an unexpected number: ' + branches);
    }

    this.endAngleChangePerFractalIteration = (2 * Math.PI) / endAngleChangesDivisor;
  }

  initForPerformanceChecks(color: Color, canvasWidth: number, canvasHeight: number): void {
    this._drawLinesAtAngles = this.getAnglesAtWhichToDrawLines(
      this.startAngleChangePerFractalIteration,
    );
    this.totalTimePassed = this.timeForGrowth;
    this.position.x = canvasWidth / 2;
    this.position.y = canvasHeight / 3;
    this._totalDrawLength = this.lineLength * 2;
    this._fromAngle = -Math.PI;
    this._color = new Color(color.r + 1, color.g + 1, color.b + 1, 0.01);
  }

  initAfterPerformanceChecks(): void {
    this._totalDrawLength = 0;
    this.totalTimePassed = 0;
    this.rotationTimePassed = 0;
    this.animationComplete = false;
    this.initialLineRetractionTimePassed = 0;
    this._color = new Color(115, 60, 45, 0.9);
    if (this.initialLineWidth < this.lineWidthChangePerFractalIteration * 4.5) {
      this._initialLineWidth = this.lineWidthChangePerFractalIteration * 4;
    }
  }

  increaseFractalIterations(logger: LoggerService): void {
    this._initialLineWidth = this.initialLineWidth + this.lineWidthChangePerFractalIteration;
    logger.log(
      LoggerChannel.FractalAnimationPerformanceCheck,
      'Increased line width to ' + this._initialLineWidth,
    );
  }

  reduceFractalIterations(logger: LoggerService): void {
    this._initialLineWidth = this.initialLineWidth - this.lineWidthChangePerFractalIteration;
    logger.log(
      LoggerChannel.FractalAnimationPerformanceCheck,
      'Decreased line width to ' + this._initialLineWidth,
    );
  }

  update(deltaTime: number): void {
    this.totalTimePassed += deltaTime;

    const unboundedFractionTreeGrowthDone = this.totalTimePassed / this.timeForGrowth;
    const fractionTreeGrowthDone =
      unboundedFractionTreeGrowthDone > 1 ? 1 : unboundedFractionTreeGrowthDone;
    this.treeGrowthDone = fractionTreeGrowthDone === 1;

    if (this.treeGrowthDone) {
      this.rotationTimePassed += deltaTime;
    }

    this.drawLengthIncludingInitialLine =
      this.lineLength * 4 * this.growthEasing(fractionTreeGrowthDone);
    this._totalDrawLength = this.drawLengthIncludingInitialLine - this.lineLength * 2;

    const unboundedFractionRotationDone = this.rotationTimePassed / this.timeForRotation;
    const fractionRotationDone =
      unboundedFractionRotationDone < 0
        ? 0
        : unboundedFractionRotationDone > 1
        ? 1
        : unboundedFractionRotationDone;
    this.animationComplete = fractionRotationDone === 1;

    if (this.totalTimePassed > this.timeBeforeInitialLineStartsRetracting) {
      this.initialLineRetractionTimePassed += deltaTime;
    }

    const unboundedFractionInitialLineRetractionDone =
      this.initialLineRetractionTimePassed / this.timeForInitialLineRetraction;
    const fractionInitialLineRetractionDone =
      unboundedFractionInitialLineRetractionDone < 0
        ? 0
        : unboundedFractionInitialLineRetractionDone > 1
        ? 1
        : unboundedFractionInitialLineRetractionDone;

    const angleChangePerFractalIteration =
      this.startAngleChangePerFractalIteration +
      (this.endAngleChangePerFractalIteration - this.startAngleChangePerFractalIteration) *
        this.rotationEasing(fractionRotationDone);

    this._fromAngle = this.rotationEasing(fractionRotationDone) * -Math.PI;

    this.initialLineDrawn = this.drawLengthIncludingInitialLine > this.lineLength * 2;
    const initialLineLengthToDraw = this.initialLineDrawn
      ? this.lineLength * 2
      : this.drawLengthIncludingInitialLine;

    let initialLineFullLengthYEnd: number;

    if (!this.treeGrowthDone) {
      initialLineFullLengthYEnd = this.lineLength * 2;
    } else {
      initialLineFullLengthYEnd =
        this.lineLength * 2 +
        this.rotationEasing(fractionRotationDone) *
          (this.endOfAnimationCenterYCoordinate - this.lineLength * 2);
    }

    const retractedLength =
      this.lineLength * 2 * this.rotationEasing(1 - fractionInitialLineRetractionDone);

    this.initialLineStart.x =
      this.initialLineFullLengthXEnd - retractedLength * Math.sin(this.fromAngle);
    this.initialLineStart.y =
      initialLineFullLengthYEnd - retractedLength * Math.cos(this.fromAngle);

    if (!this.initialLineDrawn) {
      this.position.x =
        this.initialLineStart.x + initialLineLengthToDraw * Math.sin(this.fromAngle);
      this.position.y =
        this.initialLineStart.y + initialLineLengthToDraw * Math.cos(this.fromAngle);
    } else {
      this.position.x = this.initialLineFullLengthXEnd;
      this.position.y = initialLineFullLengthYEnd;
    }

    this._drawLinesAtAngles = this.getAnglesAtWhichToDrawLines(angleChangePerFractalIteration);
  }

  draw(context: CanvasRenderingContext2D): void {
    this.drawInitialLine(context);

    if (this.totalDrawLength > 0) {
      super.draw(context);
    }
  }

  private drawInitialLine(context: CanvasRenderingContext2D): void {
    context.lineWidth = this.initialLineWidth + this.lineWidthChangePerFractalIteration;
    context.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${
      this.color.a
    })`;

    context.beginPath();
    context.moveTo(this.initialLineStart.x, this.initialLineStart.y);
    context.lineTo(this.position.x, this.position.y);
    context.stroke();
  }
}
