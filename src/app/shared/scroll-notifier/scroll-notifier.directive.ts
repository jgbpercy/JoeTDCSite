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

    @Output() public scrolledTop = new EventEmitter();
    @Output() public scrolledBottom = new EventEmitter();
    @Output() public hasScroll = new EventEmitter<boolean>();

    private currentScrollHeight = 0;
    private currentClientHeight = 0;
    private currentHasScroll : boolean;

    constructor(public elementRef : ElementRef) { }

    @HostListener('scroll', ['$event']) private onScroll(event) : void {
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

    public ngAfterViewInit() : void {

        const doFrame = (timestamp : number) => {
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
