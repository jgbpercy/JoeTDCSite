import { Component, OnInit } from '@angular/core';

import { filter } from 'rxjs/operators/filter';

import { EAMainFractalAnimationDone, EAMainFractalGrowthDone } from './fractal-animation';
import { HomeEventsService } from './services/home-events.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit { 

    public showTitle = false;
    public showWotButton = false;
    public showWotContent = false;
    
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
}
