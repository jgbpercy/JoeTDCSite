import { 
    animate, 
    state, 
    style, 
    transition, 
    trigger 
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { filter } from 'rxjs/operators/filter';

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
    
    constructor(
        private homeEventService : HomeEventsService,
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
    }

    public toggleWotContent() : void {
        this.showWotContent = !this.showWotContent;
    }

    public toggleWhoContent() : void {
        this.showWhoContent = !this.showWhoContent;
    }
}
