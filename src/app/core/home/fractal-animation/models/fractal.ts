import { getDefined } from 'shared/utils';
import { Color } from './color';
import { Vector2 } from './vector-2';
import { Vector2WithCachedAngle } from './vector-2-with-cached-angle';

export class Fractal {
  protected position: Vector2 = {
    x: 0,
    y: 0,
  };

  protected _initialLineWidth?: number;
  protected get initialLineWidth(): number {
    return getDefined(this._initialLineWidth);
  }
  protected _lineWidthChangePerFractalIteration?: number;
  protected get lineWidthChangePerFractalIteration(): number {
    return getDefined(this._lineWidthChangePerFractalIteration);
  }

  protected _lineLength?: number;
  protected get lineLength(): number {
    return getDefined(this._lineLength);
  }
  protected _totalDrawLength?: number;
  protected get totalDrawLength(): number {
    return getDefined(this._totalDrawLength);
  }

  protected _drawLinesAtAngles?: number[];
  protected get drawLinesAtAngles(): number[] {
    return getDefined(this._drawLinesAtAngles);
  }
  protected _fromAngle?: number;
  protected get fromAngle(): number {
    return getDefined(this._fromAngle);
  }

  protected _color?: Color;
  protected get color(): Color {
    return getDefined(this._color);
  }
  protected _alphaChangePerFractalIteration?: number;
  protected get alphaChangePerFractalIteration(): number {
    return getDefined(this._alphaChangePerFractalIteration);
  }

  removeThisFrame?: boolean;

  draw(context: CanvasRenderingContext2D): void {
    const drawWholeLength = this.totalDrawLength > this.lineLength;
    const actualDrawLength = drawWholeLength ? this.lineLength : this.totalDrawLength;

    const lineEnds: Vector2WithCachedAngle[] = this.drawLinesAtAngles.map(drawLineAtAngle => {
      const newAngle = this.fromAngle + drawLineAtAngle;
      return {
        x: this.position.x + actualDrawLength * Math.sin(newAngle),
        y: this.position.y + actualDrawLength * Math.cos(newAngle),
        angle: newAngle,
      };
    });

    const path = new Path2D();

    path.moveTo(this.position.x, this.position.y);

    lineEnds.forEach(lineEnd => {
      path.lineTo(lineEnd.x, lineEnd.y);
      //TODO: is this any faster as a move to?
      path.lineTo(this.position.x, this.position.y);
    });

    //TODO: Experiment with context state stack save / restore here?
    context.lineWidth = this.initialLineWidth;
    context.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${
      this.color.a
    })`;

    context.stroke(path);

    if (drawWholeLength && this.initialLineWidth - this.lineWidthChangePerFractalIteration > 0.01) {
      this.getChildren(lineEnds).forEach(child => {
        child.draw(context);
      });
    }
  }

  private getChildren(lineEnds: Vector2WithCachedAngle[]): Fractal[] {
    return lineEnds.map(lineEnd => {
      return this.getChild(lineEnd);
    });
  }

  private getChild(position: Vector2WithCachedAngle): Fractal {
    const child = new Fractal();

    child.position = position;

    child._initialLineWidth = this.initialLineWidth - this.lineWidthChangePerFractalIteration;
    child._lineWidthChangePerFractalIteration = this.lineWidthChangePerFractalIteration;

    child._lineLength = this.lineLength / 2;
    child._totalDrawLength = this.totalDrawLength - this.lineLength;

    child._drawLinesAtAngles = this.drawLinesAtAngles;
    child._fromAngle = position.angle;

    child._color = new Color(
      this.color.r,
      this.color.g,
      this.color.b,
      this.color.a - this.alphaChangePerFractalIteration,
    );
    child._alphaChangePerFractalIteration = this.alphaChangePerFractalIteration;

    this.removeThisFrame = this.removeThisFrame;

    return child;
  }
}
