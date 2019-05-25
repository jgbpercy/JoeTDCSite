import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[jtdcScrollNotifier]',
})
export class ScrollNotifierDirective implements AfterViewInit {
  @Output() scrolledTop = new EventEmitter();
  @Output() scrolledBottom = new EventEmitter();
  @Output() hasScroll = new EventEmitter<boolean>();

  private currentScrollHeight = 0;
  private currentClientHeight = 0;
  private currentHasScroll?: boolean;

  constructor(private elementRef: ElementRef) {}

  // tslint:disable-next-line:no-any
  @HostListener('scroll', ['$event']) private onScroll(event: any): void {
    const top = event.target.scrollTop;
    const height = this.elementRef.nativeElement.scrollHeight;
    const offset = this.elementRef.nativeElement.offsetHeight;

    if (top > height - offset - 1) {
      this.scrolledBottom.emit();
    }

    if (top === 0) {
      this.scrolledTop.emit();
    }
  }

  ngAfterViewInit(): void {
    const doFrame = (timestamp: number) => {
      if (this.elementRef.nativeElement.scrollHeight !== this.currentScrollHeight) {
        this.currentScrollHeight = this.elementRef.nativeElement.scrollHeight;
      }

      if (this.elementRef.nativeElement.clientHeight !== this.currentClientHeight) {
        this.currentClientHeight = this.elementRef.nativeElement.clientHeight;
      }

      if (this.currentScrollHeight !== this.currentClientHeight) {
        if (this.currentHasScroll === false || this.currentHasScroll === undefined) {
          this.currentHasScroll = true;
          this.hasScroll.emit(true);
        }
      } else {
        if (this.currentHasScroll === true || this.currentHasScroll === undefined) {
          this.currentHasScroll = false;
          this.hasScroll.emit(false);
        }
      }

      window.requestAnimationFrame(doFrame);
    };

    window.requestAnimationFrame(doFrame);
  }
}
