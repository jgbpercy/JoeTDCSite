import { Color } from './color';
import { Vector2 } from './vector-2';
import { Vector2WithCachedAngle } from './vector-2-with-cached-angle';

export class Fractal {

    protected position : Vector2 = new Vector2();

    protected initialLineWidth : number;
    protected lineWidthChangePerFractalIteration : number;
    
    protected lineLength : number;
    protected totalDrawLength : number;

    protected drawLinesAtAngles : number[];
    protected fromAngle : number;
    
    protected color : Color;
    protected alphaChangePerFractalIteration : number;
    
    public removeThisFrame : boolean;

    public draw(context : CanvasRenderingContext2D) : void {
      
        const drawWholeLength = this.totalDrawLength > this.lineLength;
        const actualDrawLength = drawWholeLength ? this.lineLength : this.totalDrawLength;

        const lineEnds : Vector2WithCachedAngle[] = this.drawLinesAtAngles.map(drawLineAtAngle => {
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
        context.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        
        context.stroke(path);

        if (drawWholeLength && this.initialLineWidth - this.lineWidthChangePerFractalIteration > 0.01) {
            this.getChildren(lineEnds).forEach(child => {
                child.draw(context);
            });
        }
    }

    private getChildren(lineEnds : Vector2WithCachedAngle[]) : Fractal[] {

        return lineEnds.map(lineEnd => {
            return this.getChild(lineEnd);
        });
    }

    private getChild(position : Vector2WithCachedAngle) : Fractal {

        const child = new Fractal();

        child.position = position;

        child.initialLineWidth = this.initialLineWidth - this.lineWidthChangePerFractalIteration;
        child.lineWidthChangePerFractalIteration = this.lineWidthChangePerFractalIteration;

        child.lineLength = this.lineLength / 2;
        child.totalDrawLength = this.totalDrawLength - this.lineLength;

        child.drawLinesAtAngles = this.drawLinesAtAngles;
        child.fromAngle = position.angle;

        child.color = new Color(
            this.color.r,
            this.color.g,
            this.color.b,
            this.color.a - this.alphaChangePerFractalIteration,
        );
        child.alphaChangePerFractalIteration = this.alphaChangePerFractalIteration;
        
        this.removeThisFrame = this.removeThisFrame;

        return child;
    }
}
