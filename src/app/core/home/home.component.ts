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

import { LoggerChannel, LoggerService } from '../services/logger.service';
import { WindowSizeService } from '../services/window-size.service';

import { EAMainFractalAnimationDone, EAMainFractalGrowthDone } from './fractal-animation';
import { HomeEventsService } from './services/home-events.service';

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
        private homeEventService : HomeEventsService,
        private windowResizeService : WindowSizeService,
        private loggerService : LoggerService,
    ) { }
    
    public ngOnInit() : void {
        this.homeEventService.homeEvents.pipe(
            filter<EAMainFractalAnimationDone>(event => event instanceof EAMainFractalAnimationDone)
        )
        .subscribe(
            event => {
                this.showWotButton = true;
            }
        );

        this.homeEventService.homeEvents.pipe(
            filter<EAMainFractalGrowthDone>(event => event instanceof EAMainFractalGrowthDone)
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
                this.contentOffsetFromCenter = this.mainFractalRadius / 4;
            } else if (size.width <= 1024) {
                this.wotButtonRadius = 40;
                this.contentOffsetFromCenter = this.mainFractalRadius / 2;
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
