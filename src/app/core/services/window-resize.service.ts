import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map } from 'rxjs/operators/map';

interface WindowSize {
    width : number;
    height : number;
}

@Injectable()
export class WindowResizeService {

    private readonly _windowWidthChange = new BehaviorSubject<number>(window.innerWidth);
    public readonly windowWidthChange = this._windowWidthChange.asObservable();

    private readonly _windowHeightChange = new BehaviorSubject<number>(window.innerHeight);
    public readonly windowHeightChange = this._windowHeightChange.asObservable();

    private readonly _windowSizeChange = new BehaviorSubject<WindowSize>({ width: window.innerWidth, height: window.innerHeight });
    public readonly windowSizeChange = this._windowSizeChange.asObservable();

    constructor() {

        const widthStream = fromEvent<Event>(window, 'resize').pipe(
            map(event => (<Window>event.target).innerWidth),
            distinctUntilChanged(),
        );

        widthStream.pipe(
            debounceTime(100),
        )
        .subscribe(res => this._windowWidthChange.next(res));

        const heightStream = fromEvent<Event>(window, 'resize').pipe(
            map(event => (<Window>event.target).innerHeight),
            distinctUntilChanged(),
        );

        heightStream.pipe(
            debounceTime(100),
        )
        .subscribe(res => this._windowHeightChange.next(res));

        combineLatest(
            widthStream,
            heightStream,
            (width, height) => ({ width, height }),
        )
        .pipe(
            debounceTime(100),
        )
        .subscribe(res => this._windowSizeChange.next(res));
    }
}
