import {
    Directive,
    ElementRef,
    OnInit,
} from '@angular/core'
import { interval } from 'rxjs/observable/interval'
import { map } from 'rxjs/operators/map'
import { take } from 'rxjs/operators/take'

import * as bezier from 'bezier-easing'

@Directive({
    selector: '[jtdcFractalAnimation]'
})
export class FractalAnimationDirective implements OnInit {

    private canvas : HTMLCanvasElement

    private timeForTreeGrowth = 3
    private timeToRotate = 3
    private timeBeforeInitialLineRetracts = 2
    private startAngleChangePerFractalIteration = Math.PI / 6
    private endAngleChangePerFractalIteration = 2 * Math.PI / 3
    private startLineWidth = 4
    private lineWidthChangePerFractalIteration = 0.5
    private startAlpha = 200
    private alphaChangePerFractalIteration = 10
    private initialLineLength = 250
    private targetFPS = 60

    constructor(private element : ElementRef) {

        this.canvas = this.element.nativeElement as HTMLCanvasElement
    }

    public ngOnInit() : void {

        const context = this.canvas.getContext('2d')

        const boundingRect = this.canvas.getBoundingClientRect()
        const width = boundingRect.width
        const height = boundingRect.height

        this.canvas.width = width
        this.canvas.height = height

        context.lineCap = 'round'
        context.lineJoin = 'round'

        const easing = bezier(0.8, 0.2, 0.45, 0.8)

        const totalTime = this.timeForTreeGrowth + this.timeToRotate
        const framesOfTreeGrowth = this.targetFPS * this.timeForTreeGrowth
        const framesOfRotation = this.targetFPS * this.timeToRotate
        const framesBeforeInitialLineRetraction = this.targetFPS * this.timeBeforeInitialLineRetracts

        const totalFrames = framesOfTreeGrowth + framesOfRotation

        const framesOfInitialLineRetraction = totalFrames - framesBeforeInitialLineRetraction

        const lineLengthIncreasePerFrame = (this.initialLineLength * 2) / framesOfTreeGrowth

        interval(1000 / this.targetFPS).pipe(take(totalFrames), map(zeroIndexedFrame => zeroIndexedFrame + 1))
        .subscribe(
            frame => {

                context.fillRect(0, 0, width, height)

                const unboundedFractionTreeGrowthDone = frame / framesOfTreeGrowth
                const fractionTreeGrowthDone = unboundedFractionTreeGrowthDone > 1 ? 1 : unboundedFractionTreeGrowthDone
                const treeGrowthDone = fractionTreeGrowthDone === 1

                const unboundedFractionRotationDone = (frame - framesOfTreeGrowth) / framesOfRotation
                const fractionRotationDone = unboundedFractionRotationDone < 0 ? 0 :
                    (unboundedFractionRotationDone > 1 ? 1 : unboundedFractionRotationDone)

                const unboundedFractionInitialLineRetractionDone =
                    (frame - framesBeforeInitialLineRetraction) / framesOfInitialLineRetraction
                const fractionInitialLineRetractionDone = unboundedFractionInitialLineRetractionDone < 0 ? 0 :
                    (unboundedFractionInitialLineRetractionDone > 1 ? 1 : unboundedFractionInitialLineRetractionDone)

                const angleChange = this.startAngleChangePerFractalIteration
                    + (this.endAngleChangePerFractalIteration - this.startAngleChangePerFractalIteration)
                    * Math.pow(fractionRotationDone, 6)

                const angleOfFirstLine = easing(fractionRotationDone) * -Math.PI

                let lengthToDraw = lineLengthIncreasePerFrame * frame
                const drawWholeInitialLine = lengthToDraw > this.initialLineLength
                lengthToDraw = drawWholeInitialLine ? this.initialLineLength : lengthToDraw

                let fullLengthXEnd : number
                let fullLengthYEnd : number

                if (!treeGrowthDone) {
                    fullLengthXEnd = width * 0.5
                    fullLengthYEnd = this.initialLineLength
                } else {
                    fullLengthXEnd = width * 0.5
                    fullLengthYEnd = this.initialLineLength + easing(fractionRotationDone) * 200
                }

                const retractedLength = this.initialLineLength * easing(1 - fractionInitialLineRetractionDone)

                let xStart : number
                let yStart : number

                let xEnd : number
                let yEnd : number

                xStart = fullLengthXEnd - retractedLength * Math.sin(angleOfFirstLine)
                yStart = fullLengthYEnd - retractedLength * Math.cos(angleOfFirstLine)

                if (!drawWholeInitialLine) {
                    xEnd = xStart + lengthToDraw * Math.sin(angleOfFirstLine)
                    yEnd = yStart + lengthToDraw * Math.cos(angleOfFirstLine)
                } else {
                    xEnd = fullLengthXEnd
                    yEnd = fullLengthYEnd
                }

                context.lineWidth = this.startLineWidth
                context.strokeStyle = `rgba(60, 40, 40, ${this.startAlpha})`

                this.drawLine(context, xStart, yStart, xEnd, yEnd)

                if (drawWholeInitialLine) {
                    this.drawFractalSplit(
                        context,
                        frame - 1 / (lineLengthIncreasePerFrame / this.initialLineLength),
                        lineLengthIncreasePerFrame,
                        fullLengthXEnd,
                        fullLengthYEnd,
                        this.initialLineLength / 2,
                        angleOfFirstLine,
                        [-angleChange, 0, angleChange],
                        this.startLineWidth - this.lineWidthChangePerFractalIteration,
                        this.lineWidthChangePerFractalIteration,
                        this.startAlpha - this.alphaChangePerFractalIteration,
                        this.alphaChangePerFractalIteration
                    )
                }
            }
        )
    }

    private drawFractalSplit(
        context : CanvasRenderingContext2D,
        iteration : number,
        lineLengthIncreasePerFrame : number,
        xStart : number,
        yStart : number,
        length : number,
        fromAngle : number,
        drawLinesAtAngles : number[],
        lineWidth : number,
        lineWidthChange : number,
        alpha : number,
        alphaChange : number
    ) : void {

        let lengthToDraw = lineLengthIncreasePerFrame * iteration
        const drawWholeLength = lengthToDraw >= length
        lengthToDraw = drawWholeLength ? length : lengthToDraw

        const linesToDraw = drawLinesAtAngles.map(angle => {
            return {
                xEnd: xStart + lengthToDraw * Math.sin(fromAngle + angle),
                yEnd: yStart + lengthToDraw * Math.cos(fromAngle + angle),
                angle: fromAngle + angle
            }
        })

        context.lineWidth = lineWidth
        context.strokeStyle = `rgba(60, 40, 40, ${alpha})`

        linesToDraw.forEach(line => {
            this.drawLine(context, xStart, yStart, line.xEnd, line.yEnd)
        })

        const nextLineWidth = lineWidth - lineWidthChange
        const newAlpha = alpha - alphaChange

        if (nextLineWidth > 0 && drawWholeLength) {

            linesToDraw.forEach(line => {
                this.drawFractalSplit(
                    context,
                    lineLengthIncreasePerFrame,
                    iteration - 1 / (lineLengthIncreasePerFrame / length),
                    line.xEnd,
                    line.yEnd,
                    length / 2,
                    line.angle,
                    drawLinesAtAngles,
                    nextLineWidth,
                    lineWidthChange,
                    newAlpha,
                    alphaChange
                )
            })
        }
    }

    private drawLine(
        context : CanvasRenderingContext2D,
        xStart : number,
        yStart : number,
        xEnd : number,
        yEnd : number,
    ) : void {

        context.beginPath()
        context.moveTo(xStart, yStart)

        context.lineTo(xEnd, yEnd)
        context.stroke()
    }
}
