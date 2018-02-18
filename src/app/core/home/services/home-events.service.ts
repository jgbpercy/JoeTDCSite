import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export class EventArgs {
    public readonly emitter : object;
    constructor(emitter : object) {
        this.emitter = emitter;
    }
}

@Injectable()
export class HomeEventsService {

    private readonly _homeEvents = new Subject<EventArgs>();
    public readonly homeEvents = this._homeEvents.asObservable();

    public emit<TEventArgs extends EventArgs>(eventArgs : TEventArgs) {
        this._homeEvents.next(eventArgs);
    }
}
