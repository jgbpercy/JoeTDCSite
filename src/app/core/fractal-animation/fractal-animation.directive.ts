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

class Color {
    public r : number
    public g : number
    public b : number
    public a : number

    constructor(r : number, g : number, b : number, a : number) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }
}

class Fractal {

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

class Star extends Fractal {

    private timeToFadeIn = 0.7
    private framesToFadeIn : number
    private fadeInFramesElapsed = 0

    private timeToTwinkle = 0.1
    private framesToHalfTwinkle : number
    private twinkleFramesElapsed = 0

    private twinkleChancePerSecond = 0.1
    private twinkleChancePerFrame : number

    private normalAlpha : number

    public constructor(
        canvasWidth : number,
        canvasHeight : number,
        targetFrameRate : number,
        mainFractalCenterX : number,
        mainFractalCenterY : number,
        mainFractalExclusionLength : number,
    ) {

        super()

        this.framesToFadeIn = this.timeToFadeIn * targetFrameRate
        this.framesToHalfTwinkle = this.timeToTwinkle * targetFrameRate

        this.fadeInFramesElapsed = 0

        this.initialLineLength = lodash.random(3, 7, false)

        this.alphaChangePerFractalIteration = 0

        let foundPos = false
        let iteration = 0
        while (!foundPos && iteration < 10) {

            this.yPos = lodash.random(0, 3 * canvasHeight / 4, true)
            this.xPos = lodash.random(0, canvasWidth, true)

            const xFromMainFractalCenter = this.xPos - mainFractalCenterX
            const yFromMainFractalCenter = this.yPos - mainFractalCenterY

            if (Math.pow(xFromMainFractalCenter, 2) + Math.pow(yFromMainFractalCenter, 2) > Math.pow(mainFractalExclusionLength, 2)) {
                foundPos = true
            } else {
                iteration += 1
            }
        }

        this.fromAngle = 0

        this.color = {
            r: lodash.random(100, 120, false),
            g: 100,
            b: lodash.random(80, 100, false),
            a: 0,
        }

        this.normalAlpha = ((0.9 + 0.1 * lodash.random(0, 1, true)) * (canvasHeight - this.yPos) / canvasHeight)

        this.startLineWidth = 1.5
        this.lineWidthChangePerFractalIteration = 0.5

        this.drawLinesAtAngles = [
            0,
            Math.PI / 2,
            Math.PI,
            3 * Math.PI / 2,
        ]

        this.twinkleChancePerFrame = 1 - Math.pow(1 - this.twinkleChancePerSecond, 1 / targetFrameRate)
    }

    public update() {

        if (this.fadeInFramesElapsed <= this.framesToFadeIn) {

            this.color.a = this.normalAlpha * this.fadeInFramesElapsed / this.framesToFadeIn
            this.fadeInFramesElapsed += 1

        } else if (this.twinkleFramesElapsed > 0) {

            if (this.twinkleFramesElapsed === this.framesToHalfTwinkle * 2) {
                this.color.a = this.normalAlpha
                this.twinkleFramesElapsed = 0
            } else {

                if (this.twinkleFramesElapsed <= this.framesToHalfTwinkle) {
                    this.color.a = this.normalAlpha
                        + (this.twinkleFramesElapsed / this.framesToHalfTwinkle) * (1 - this.normalAlpha)
                } else {
                    this.color.a = this.normalAlpha
                        + ((2 * this.framesToHalfTwinkle - this.twinkleFramesElapsed) / this.framesToHalfTwinkle) * (1 - this.normalAlpha)
                }

                this.twinkleFramesElapsed += 1
            }
        } else {
            if (lodash.random(0, 1, true) < this.twinkleChancePerFrame) {
                this.twinkleFramesElapsed = 1
            }
        }
    }
}

class SnowFlake extends Fractal {

    public speed : number

    public rotationSpeed : number

    public constructor(canvasWidth : number) {

        super()

        this.initialLineLength = lodash.random(8, 16, false)

        this.speed = (1 + lodash.random(0.3)) * this.initialLineLength / 4

        this.rotationSpeed = lodash.random(0.03, 0.1, true)
        const rotationDirection = lodash.random(0, 1, true) > 0.5 ? -1 : 1
        this.rotationSpeed *= rotationDirection

        this.alphaChangePerFractalIteration = 0.05

        this.yPos = -this.initialLineLength * 2
        this.xPos = lodash.random(0, canvasWidth, true)
        this.fromAngle = 0
        this.removeThisFrame = false

        this.color = {
            r: lodash.random(120, 130, false),
            g: lodash.random(120, 130, false),
            b: lodash.random(130, 155, false),
            a: 0.5,
        }

        let branches = lodash.random(4, 6, false)
        branches = branches === 4 ? 3 : branches

        this.lineWidthChangePerFractalIteration = 0.5

        //TODO: this can be factored with stuff below
        if (branches === 3) {

            this.startLineWidth = 2

            this.drawLinesAtAngles = [
                -2 * Math.PI / 3,
                0,
                2 * Math.PI / 3,
            ]

        } else if (branches === 5) {

            this.startLineWidth = 1.5

            this.drawLinesAtAngles = [
                -4 * Math.PI / 5,
                -2 * Math.PI / 5,
                0,
                2 * Math.PI / 5,
                4 * Math.PI / 5,
            ]

        } else if (branches === 6) {

            this.startLineWidth = 1.5

            this.drawLinesAtAngles = [
                -2 * Math.PI / 3,
                -1 * Math.PI / 3,
                0,
                1 * Math.PI / 3,
                2 * Math.PI / 3,
                Math.PI,
            ]

        }
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

    private mainFractalEndYCoord = 200

    private timeForTreeGrowth = 3
    private timeToRotate = 20
    private timeBeforeInitialLineRetracts = 2
    private timeBeforeSpawningSnowFlakes = 4
    private timeBetweenSnowFlakeSpawns = 0.4
    private timeBetweenStarSpawns = 0.01

    private numberOfStars = 40

    private lineWidthChangePerFractalIteration = 0.5

    private startAlpha = 0.9
    private alphaChangePerFractalIteration = 0.075

    private initialLineLength = 250

    private targetFPS = 30

    private snowFlakes : SnowFlake[] = new Array<SnowFlake>()
    private stars : Star[] = new Array<Star>()

    constructor(private element : ElementRef) {

        this.canvas = this.element.nativeElement as HTMLCanvasElement
    }

    public ngOnInit() : void {

        const context = this.canvas.getContext('2d')

        const boundingRect = this.canvas.getBoundingClientRect()
        const canvasWidth = boundingRect.width
        const canvasHeight = boundingRect.height

        this.canvas.width = canvasWidth
        this.canvas.height = canvasHeight

        context.lineCap = 'round'
        context.lineJoin = 'round'

        const easing = bezier(0.8, 0.2, 0.45, 0.8)

        const mainTreeBranches = lodash.random(3, 6, false)
        let treeStartLineWidth : number
        let getTreeDrawLinesAtAngles : (angleChangePerFractalIteration : number) => number[]
        let startAngleChangePerFractalIteration

        if (mainTreeBranches === 3) {

            treeStartLineWidth = 4

            startAngleChangePerFractalIteration = Math.PI / lodash.random(4.5, 7.5, true)
            getTreeDrawLinesAtAngles = angleChangePerFractalIteration => [
                -angleChangePerFractalIteration,
                0,
                angleChangePerFractalIteration,
            ]

        } else if (mainTreeBranches === 4) {

            treeStartLineWidth = 3.5

            startAngleChangePerFractalIteration = Math.PI / lodash.random(5, 7.5, true)
            getTreeDrawLinesAtAngles = angleChangePerFractalIteration => [
                -1.5 * angleChangePerFractalIteration,
                -0.5 * angleChangePerFractalIteration,
                0.5 * angleChangePerFractalIteration,
                1.5 * angleChangePerFractalIteration,
            ]

        } else if (mainTreeBranches === 5) {

            treeStartLineWidth = 3

            startAngleChangePerFractalIteration = Math.PI / lodash.random(5.5, 8, true)
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

        const endAngleChangePerFractalIteration = 2 * Math.PI / lodash.random(3, 7, false)

        const totalTime = this.timeForTreeGrowth + this.timeToRotate
        const framesOfTreeGrowth = this.targetFPS * this.timeForTreeGrowth
        const framesOfRotation = this.targetFPS * this.timeToRotate
        const framesBeforeInitialLineRetraction = this.targetFPS * this.timeBeforeInitialLineRetracts
        const framesBeforeSpawningSnowFlakes = this.targetFPS * this.timeBeforeSpawningSnowFlakes
        const framesBetweenSnowFlakeSpawns = this.targetFPS * this.timeBetweenSnowFlakeSpawns
        const framesBetweenStarSpawns = this.targetFPS * this.timeBetweenStarSpawns

        let framesSinceLastSnowFlakeSpawn = framesBetweenSnowFlakeSpawns
        let framesSinceLastStarSpawned = framesBetweenStarSpawns
        let starsCreated = false

        const totalFrames = framesOfTreeGrowth + framesOfRotation

        const framesOfInitialLineRetraction = totalFrames - framesBeforeInitialLineRetraction

        const lineLengthDrawnIncreasePerFrame = (this.initialLineLength * 2) / framesOfTreeGrowth

        interval(1000 / this.targetFPS).pipe( map(zeroIndexedFrame => zeroIndexedFrame + 1))
        .subscribe(
            frame => {

                context.fillRect(0, 0, canvasWidth, canvasHeight)

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

                let lengthToDraw = lineLengthDrawnIncreasePerFrame * frame
                const drawWholeInitialLine = lengthToDraw > this.initialLineLength
                lengthToDraw = drawWholeInitialLine ? this.initialLineLength : lengthToDraw

                let fullLengthXEnd : number
                let fullLengthYEnd : number

                if (!treeGrowthDone) {
                    fullLengthXEnd = canvasWidth * 0.5
                    fullLengthYEnd = this.initialLineLength
                } else {
                    fullLengthXEnd = canvasWidth * 0.5
                    fullLengthYEnd = this.initialLineLength + easing(fractionRotationDone) * this.mainFractalEndYCoord
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

                if (frame > framesBeforeSpawningSnowFlakes) {

                    if (framesSinceLastSnowFlakeSpawn >= framesBetweenSnowFlakeSpawns) {
                        this.snowFlakes.push(new SnowFlake(canvasWidth))
                        framesSinceLastSnowFlakeSpawn = 0
                    } else {
                        framesSinceLastSnowFlakeSpawn += 1
                    }

                    this.snowFlakes.forEach(snowFlake => {

                        if (snowFlake.yPos > canvasHeight - 2 * snowFlake.initialLineLength) {
                            snowFlake.removeThisFrame = true
                        }

                        this.drawFractalSplit(
                            context,
                            true,
                            frame,
                            lineLengthDrawnIncreasePerFrame,
                            snowFlake.xPos,
                            snowFlake.yPos,
                            snowFlake.initialLineLength,
                            snowFlake.fromAngle,
                            snowFlake.drawLinesAtAngles,
                            snowFlake.startLineWidth,
                            snowFlake.lineWidthChangePerFractalIteration,
                            snowFlake.color,
                            snowFlake.alphaChangePerFractalIteration,
                        )

                        snowFlake.move()
                    })

                    this.snowFlakes = this.snowFlakes.filter(snowFlake => !snowFlake.removeThisFrame)

                    if (!starsCreated) {
                        if (framesSinceLastStarSpawned >= framesBetweenStarSpawns) {

                            this.stars.push(new Star(
                                canvasWidth,
                                canvasHeight,
                                this.targetFPS,
                                canvasWidth * 0.5,
                                this.mainFractalEndYCoord + this.initialLineLength,
                                this.initialLineLength,
                            ))

                            framesSinceLastStarSpawned = 0

                        } else {
                            framesSinceLastStarSpawned += 1
                        }

                        if (this.stars.length >= this.numberOfStars) {
                            starsCreated = true
                        }
                    }

                    this.stars.forEach(star => {
                        this.drawFractalSplit(
                            context,
                            true,
                            frame,
                            lineLengthDrawnIncreasePerFrame,
                            star.xPos,
                            star.yPos,
                            star.initialLineLength,
                            star.fromAngle,
                            star.drawLinesAtAngles,
                            star.startLineWidth,
                            star.lineWidthChangePerFractalIteration,
                            star.color,
                            star.alphaChangePerFractalIteration,
                        )

                        star.update()
                    })

                }

                context.lineWidth = treeStartLineWidth
                context.strokeStyle = `rgba(60, 40, 40, ${this.startAlpha})`

                context.beginPath()
                context.moveTo(xStart, yStart)
                context.lineTo(xEnd, yEnd)
                context.stroke()

                if (drawWholeInitialLine) {
                    this.drawFractalSplit(
                        context,
                        false,
                        frame - 1 / (lineLengthDrawnIncreasePerFrame / this.initialLineLength),
                        lineLengthDrawnIncreasePerFrame,
                        fullLengthXEnd,
                        fullLengthYEnd,
                        this.initialLineLength / 2,
                        angleOfFirstLine,
                        getTreeDrawLinesAtAngles(angleChangePerFractalIteration),
                        treeStartLineWidth - this.lineWidthChangePerFractalIteration,
                        this.lineWidthChangePerFractalIteration,
                        new Color(60, 40, 40, this.startAlpha),
                        this.alphaChangePerFractalIteration
                    )
                }

            }
        )
    }

    private drawFractalSplit(
        context : CanvasRenderingContext2D,
        drawAll : boolean,
        frame : number,
        lineLengthDrawnIncreasePerFrame : number,
        xStart : number,
        yStart : number,
        length : number,
        fromAngle : number,
        drawLinesAtAngles : number[],
        lineWidth : number,
        lineWidthChange : number,
        color : Color,
        alphaChange : number
    ) : void {

        let lengthToDraw : number
        let drawWholeLength : boolean
        if (drawAll) {
            lengthToDraw = length
            drawWholeLength = true
        } else {
            lengthToDraw = lineLengthDrawnIncreasePerFrame * frame
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

        const path = new Path2D()

        path.moveTo(xStart, yStart)

        linesToDraw.forEach(line => {
            path.lineTo(line.xEnd, line.yEnd)
            path.lineTo(xStart, yStart)
        })

        context.lineWidth = lineWidth
        context.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
        
        context.stroke(path)

        const nextLineWidth = lineWidth - lineWidthChange
        const newAlpha = color.a - alphaChange

        if (nextLineWidth > 0 && drawWholeLength) {

            linesToDraw.forEach(line => {
                this.drawFractalSplit(
                    context,
                    drawAll,
                    lineLengthDrawnIncreasePerFrame,
                    frame - 1 / (lineLengthDrawnIncreasePerFrame / length),
                    line.xEnd,
                    line.yEnd,
                    length / 2,
                    line.angle,
                    drawLinesAtAngles,
                    nextLineWidth,
                    lineWidthChange,
                    new Color(color.r, color.g, color.b, newAlpha),
                    alphaChange
                )
            })
        }
    }
}
