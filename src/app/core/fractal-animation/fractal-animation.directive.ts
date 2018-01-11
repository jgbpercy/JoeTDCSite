import {
    Directive,
    ElementRef,
    OnInit,
} from '@angular/core'
import { interval } from 'rxjs/observable/interval'
import { map } from 'rxjs/operators/map'
import { take } from 'rxjs/operators/take'

import * as bezier from 'bezier-easing'
import * as lodash from 'lodash'

class SnowFlake {

    public startLineWidth = 2
    public lineWidthChangePerFractalIteration = 0.5

    public startAlpha = 200
    public alphaChangePerFractalIteration = 10

    public initialLineLength = 15

    public speed = 4

    public rotationSpeed = 0.05

    public xPos : number
    public yPos : number

    public fromAngle : number

    public removeThisFrame : boolean

    public constructor(canvasWidth : number) {
        this.yPos = -this.initialLineLength * 2
        this.xPos = Math.random() * canvasWidth
        this.fromAngle = 0
        this.removeThisFrame = false
    }

    public move() {
        this.yPos += this.speed
        this.fromAngle += this.rotationSpeed
        if (this.fromAngle > 2 * Math.PI) {
            this.fromAngle -= 2 * Math.PI
        } else if (this.fromAngle < 0) {
            this.fromAngle += 2 * Math.PI
        }
    }
}

@Directive({
    selector: '[jtdcFractalAnimation]'
})
export class FractalAnimationDirective implements OnInit {

    private canvas : HTMLCanvasElement

    private timeForTreeGrowth = 3
    private timeToRotate = 3
    private timeBeforeInitialLineRetracts = 2
    private timeBeforeSpawningSnowFlakes = 4
    private timeBetweenSnowFlakeSpawns = 0.4

    private lineWidthChangePerFractalIteration = 0.5

    private startAlpha = 200
    private alphaChangePerFractalIteration = 10

    private initialLineLength = 250

    private targetFPS = 30

    private snowFlakes : SnowFlake[] = new Array<SnowFlake>()

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

        const mainTreeBranches = lodash.random(3, 6, false)
        let treeStartLineWidth : number
        let getTreeDrawLinesAtAngles : (angleChangePerFractalIteration : number) => number[]
        let startAngleChangePerFractalIteration

        if (mainTreeBranches === 3) {

            treeStartLineWidth = 4

            startAngleChangePerFractalIteration = Math.PI / lodash.random(4.5, 7.5)
            getTreeDrawLinesAtAngles = angleChangePerFractalIteration => [
                -angleChangePerFractalIteration,
                0,
                angleChangePerFractalIteration,
            ]

        } else if (mainTreeBranches === 4) {

            treeStartLineWidth = 3.5

            startAngleChangePerFractalIteration = Math.PI / lodash.random(5, 7.5)
            getTreeDrawLinesAtAngles = angleChangePerFractalIteration => [
                -1.5 * angleChangePerFractalIteration,
                -0.5 * angleChangePerFractalIteration,
                0.5 * angleChangePerFractalIteration,
                1.5 * angleChangePerFractalIteration,
            ]

        } else if (mainTreeBranches === 5) {

            treeStartLineWidth = 3

            startAngleChangePerFractalIteration = Math.PI / lodash.random(5.5, 8)
            getTreeDrawLinesAtAngles = angleChangePerFractalIteration => [
                -2 * angleChangePerFractalIteration,
                -angleChangePerFractalIteration,
                0,
                angleChangePerFractalIteration,
                2 * angleChangePerFractalIteration
            ]

        } else if (mainTreeBranches === 6) {

            treeStartLineWidth = 3

            startAngleChangePerFractalIteration = Math.PI / lodash.random(6, 8, true)
            getTreeDrawLinesAtAngles = angleChangePerFractalIteration => [
                -2.5 * angleChangePerFractalIteration,
                -1.5 * angleChangePerFractalIteration,
                -0.5 * angleChangePerFractalIteration,
                0.5 * angleChangePerFractalIteration,
                1.5 * angleChangePerFractalIteration,
                2.5 * angleChangePerFractalIteration
            ]

        } else {
            console.error('mainTreeBranches was an unexpected number: ' + mainTreeBranches)
        }

        const endAngleChangePerFractalIteration = 2 * Math.PI / lodash.random(3, 8, false)

        const totalTime = this.timeForTreeGrowth + this.timeToRotate
        const framesOfTreeGrowth = this.targetFPS * this.timeForTreeGrowth
        const framesOfRotation = this.targetFPS * this.timeToRotate
        const framesBeforeInitialLineRetraction = this.targetFPS * this.timeBeforeInitialLineRetracts
        const framesBeforeSpawningSnowFlakes = this.targetFPS * this.timeBeforeSpawningSnowFlakes
        const framesBetweenSnowFlakeSpawns = this.targetFPS * this.timeBetweenSnowFlakeSpawns
        let framesSinceLastSnowFlakeSpawn = framesBetweenSnowFlakeSpawns

        const totalFrames = framesOfTreeGrowth + framesOfRotation

        const framesOfInitialLineRetraction = totalFrames - framesBeforeInitialLineRetraction

        const lineLengthIncreasePerFrame = (this.initialLineLength * 2) / framesOfTreeGrowth

        interval(1000 / this.targetFPS).pipe( map(zeroIndexedFrame => zeroIndexedFrame + 1))
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

                const angleChangePerFractalIteration = startAngleChangePerFractalIteration
                    + (endAngleChangePerFractalIteration - startAngleChangePerFractalIteration)
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

                context.lineWidth = treeStartLineWidth
                context.strokeStyle = `rgba(60, 40, 40, ${this.startAlpha})`

                this.drawLine(context, xStart, yStart, xEnd, yEnd)

                if (drawWholeInitialLine) {
                    this.drawFractalSplit(
                        context,
                        false,
                        frame - 1 / (lineLengthIncreasePerFrame / this.initialLineLength),
                        lineLengthIncreasePerFrame,
                        fullLengthXEnd,
                        fullLengthYEnd,
                        this.initialLineLength / 2,
                        angleOfFirstLine,
                        getTreeDrawLinesAtAngles(angleChangePerFractalIteration),
                        treeStartLineWidth - this.lineWidthChangePerFractalIteration,
                        this.lineWidthChangePerFractalIteration,
                        this.startAlpha - this.alphaChangePerFractalIteration,
                        this.alphaChangePerFractalIteration
                    )
                }

                if (frame > framesBeforeSpawningSnowFlakes) {
                    if (framesSinceLastSnowFlakeSpawn >= framesBetweenSnowFlakeSpawns) {
                        this.snowFlakes.push(new SnowFlake(width))
                        framesSinceLastSnowFlakeSpawn = 0
                    } else {
                        framesSinceLastSnowFlakeSpawn += 1
                    }

                    this.snowFlakes.forEach(snowFlake => {

                        if (snowFlake.yPos > height - 2 * snowFlake.initialLineLength) {
                            snowFlake.removeThisFrame = true
                        }

                        this.drawFractalSplit(
                            context,
                            true,
                            frame,
                            lineLengthIncreasePerFrame,
                            snowFlake.xPos,
                            snowFlake.yPos,
                            snowFlake.initialLineLength,
                            snowFlake.fromAngle,
                            [-2 * Math.PI / 3, 0, 2 * Math.PI / 3],
                            snowFlake.startLineWidth,
                            snowFlake.lineWidthChangePerFractalIteration,
                            snowFlake.startAlpha,
                            snowFlake.alphaChangePerFractalIteration
                        )

                        snowFlake.move()
                    })

                    this.snowFlakes = this.snowFlakes.filter(snowFlake => !snowFlake.removeThisFrame)
                }
            }
        )
    }

    private drawFractalSplit(
        context : CanvasRenderingContext2D,
        drawAll : boolean,
        frame : number,
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

        let lengthToDraw : number
        let drawWholeLength : boolean
        if (drawAll) {
            lengthToDraw = length
            drawWholeLength = true
        } else {
            lengthToDraw = lineLengthIncreasePerFrame * frame
            drawWholeLength = lengthToDraw >= length
            lengthToDraw = drawWholeLength ? length : lengthToDraw
        }

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
                    drawAll,
                    lineLengthIncreasePerFrame,
                    frame - 1 / (lineLengthIncreasePerFrame / length),
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
