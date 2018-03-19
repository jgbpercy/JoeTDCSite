import { 
    animate, 
    state, 
    style, 
    transition, 
    trigger 
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators/delay';
import { filter } from 'rxjs/operators/filter';
import { tap } from 'rxjs/operators/tap';

import {
    EventsService,
    LoggerChannel,
    LoggerService,
    WindowSizeService,
} from 'core/services';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    animations: [
        trigger('wotContentIsShown', [
            transition(':enter', [
                style({
                    left: 'calc(50% + 80px)',
                    opacity: 0,
                }),
                animate('0.2s 0.25s ease-in-out')
            ]),
            transition(':leave', [
                animate('0.2s 0s ease-in-out',
                    // tslint:disable-next-line:align
                    style({
                        left: 'calc(50% + 80px)',
                        opacity: 0,
                    })
                )
            ])
        ]),        
        trigger('whoContentIsShown', [
            transition(':enter', [
                style({
                    left: 'calc(50% - 380px)',
                    opacity: 0,
                }),
                animate('0.2s 0.25s ease-in-out')
            ]),
            transition(':leave', [
                animate('0.2s 0s ease-in-out',
                    // tslint:disable-next-line:align
                    style({
                        left: 'calc(50% - 380px)',
                        opacity: 0,
                    })
                )
            ])
        ]),
    ],
})
export class HomeComponent implements OnInit { 

    public showTitleAndWhoButton = false;
    public showWotButton = false;
    public showWotContent = false;
    public showWhoContent = false;

    public showAnimation = false;

    public canvasHeight = 1;
    public canvasWidth = 1;
    public mainFractalRadius = 1;
    public mainFractalCenterY = 1;

    public wotButtonRadius : number;

    public contentOffsetFromCenter : number;
    public contentEdgeMargin = 10;

    public whoContentMaxWidth = 300;
    public whoContentWidth : number;
    public whoContentLeft : number;

    public wotContentLeft : number;
    public wotContentWidth : number;
    
    constructor(
        private eventsService : EventsService,
        private windowResizeService : WindowSizeService,
        private loggerService : LoggerService,
    ) { }
    
    public ngOnInit() : void {
        this.eventsService.events.pipe(
            filter(event => event.type === 'Main Fractal Animation Done')
        )
        .subscribe(
            event => {
                this.showWotButton = true;
            }
        );

        this.eventsService.events.pipe(
            filter(event => event.type === 'Main Fractal Growth Done')
        )
        .subscribe(
            event => { 
                this.showTitleAndWhoButton = true;
            }
        );

        this.windowResizeService.windowSizeChange
        .pipe(
            tap(size => this.showAnimation = false),
            delay(3),
        )
        .subscribe(size => {

            this.showAnimation = true;

            this.canvasHeight = size.height;
            this.canvasWidth = size.width;

            this.mainFractalRadius = Math.min(size.height / 4, size.width / 3);
            this.mainFractalCenterY = size.height / 2;

            if (size.width <= 812) {
                this.wotButtonRadius = 30;
                if (size.width < size.height) {
                    this.contentOffsetFromCenter = this.mainFractalRadius / 4;
                } else {
                    this.contentOffsetFromCenter = this.mainFractalRadius;
                }
            } else if (size.width <= 1024) {
                this.wotButtonRadius = 40;
                if (size.width < size.height) {
                    this.contentOffsetFromCenter = this.mainFractalRadius / 2;
                } else {
                    this.contentOffsetFromCenter = this.mainFractalRadius;
                }
            } else {
                this.wotButtonRadius = 50;
                this.contentOffsetFromCenter = this.mainFractalRadius;
            }

            this.wotContentLeft = (size.width / 2) + this.contentOffsetFromCenter;
            this.wotContentWidth = (size.width / 2) - this.contentOffsetFromCenter - this.contentEdgeMargin;

            const whoContentUnrestrictedLeft = (size.width / 2) - this.contentOffsetFromCenter - this.whoContentMaxWidth;
            if (whoContentUnrestrictedLeft < this.contentEdgeMargin) {
                this.whoContentWidth = (size.width / 2) - this.contentEdgeMargin - this.contentOffsetFromCenter;
                this.whoContentLeft = this.contentEdgeMargin;
            } else {
                this.whoContentWidth = this.whoContentMaxWidth;
                this.whoContentLeft = whoContentUnrestrictedLeft;
            }
        });
    }

    public toggleWotContent() : void {
        this.showWotContent = !this.showWotContent;
    }

    public toggleWhoContent() : void {
        this.showWhoContent = !this.showWhoContent;
    }
}
