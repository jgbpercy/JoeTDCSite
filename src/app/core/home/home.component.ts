import { Component, OnInit } from '@angular/core';
import { EventsService, WindowSizeService } from 'core/services';
import { delay, filter, tap } from 'rxjs/operators';
import { homeAnimations } from './home.component.anim';

@Component({
  templateUrl: './home.component.html',
  animations: homeAnimations,
})
export class HomeComponent implements OnInit {
  showTitleAndWhoButton = false;
  showWotButton = false;
  showWotContent = false;
  showWhoContent = false;

  showAnimation = false;

  canvasHeight = 1;
  canvasWidth = 1;
  mainFractalRadius = 1;
  mainFractalCenterY = 1;

  wotButtonRadius?: number;

  contentOffsetFromCenter?: number;
  contentEdgeMargin = 10;

  whoContentMaxWidth = 300;
  whoContentWidth?: number;
  whoContentLeft?: number;

  wotContentLeft?: number;
  wotContentWidth?: number;

  constructor(
    private eventsService: EventsService,
    private windowResizeService: WindowSizeService,
  ) {}

  ngOnInit(): void {
    this.eventsService.events
      .pipe(filter(event => event.type === 'Main Fractal Animation Done'))
      .subscribe(event => {
        this.showWotButton = true;
      });

    this.eventsService.events
      .pipe(filter(event => event.type === 'Main Fractal Growth Done'))
      .subscribe(event => {
        this.showTitleAndWhoButton = true;
      });

    this.windowResizeService.windowSizeChange
      .pipe(
        tap(size => (this.showAnimation = false)),
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

        this.wotContentLeft = size.width / 2 + this.contentOffsetFromCenter;
        this.wotContentWidth =
          size.width / 2 - this.contentOffsetFromCenter - this.contentEdgeMargin;

        const whoContentUnrestrictedLeft =
          size.width / 2 - this.contentOffsetFromCenter - this.whoContentMaxWidth;
        if (whoContentUnrestrictedLeft < this.contentEdgeMargin) {
          this.whoContentWidth =
            size.width / 2 - this.contentEdgeMargin - this.contentOffsetFromCenter;
          this.whoContentLeft = this.contentEdgeMargin;
        } else {
          this.whoContentWidth = this.whoContentMaxWidth;
          this.whoContentLeft = whoContentUnrestrictedLeft;
        }
      });
  }

  toggleWotContent(): void {
    this.showWotContent = !this.showWotContent;
  }

  toggleWhoContent(): void {
    this.showWhoContent = !this.showWhoContent;
  }
}
