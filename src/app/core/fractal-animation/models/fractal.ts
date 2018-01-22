import { Color } from './color'

export class Fractal {

    public startLineWidth : number
    public lineWidthChangePerFractalIteration : number

    public alphaChangePerFractalIteration : number

    public initialLineLength : number

    public xPos : number
    public yPos : number

    public fromAngle : number

    public drawLinesAtAngles : number[]

    public removeThisFrame : boolean

    public color : Color
}
