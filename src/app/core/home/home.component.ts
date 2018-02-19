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

import { WindowResizeService } from '../services/window-resize.service';
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

    public showTitle = false;
    public showWotButton = false;
    public showWotContent = false;
    public showWhoContent = false;

    public showAnimation = false;

    public canvasHeight = 1;
    public canvasWidth = 1;
    public mainFractalRadius = 1;
    public mainFractalCenterY = 1;

    public wotButtonRadius = 50;
    public whoContentWidth = 300;
    
    constructor(
        private homeEventService : HomeEventsService,
        private windowResizeService : WindowResizeService,
    ) { }
    
    public ngOnInit() : void {
        this.homeEventService.homeEvents.pipe(
            filter<EAMainFractalAnimationDone>(event => event instanceof EAMainFractalAnimationDone)
        )
        .subscribe(
            event => this.showWotButton = true
        );

        this.homeEventService.homeEvents.pipe(
            filter<EAMainFractalGrowthDone>(event => event instanceof EAMainFractalGrowthDone)
        )
        .subscribe(
            event => this.showTitle = true
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
            this.mainFractalRadius = size.height / 4;
            this.mainFractalCenterY = size.height / 2;
        });
    }

    public toggleWotContent() : void {
        this.showWotContent = !this.showWotContent;
    }

    public toggleWhoContent() : void {
        this.showWhoContent = !this.showWhoContent;
    }
}
