import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export class EventArgs {
    public readonly emitter : object;
    constructor(emitter : object) {
        this.emitter = emitter;
    }
}

export interface EventContent {
    type : EventType;
    args : EventArgs;
}

export type EventType = 
    'Main Fractal Animation Done' |
    'Main Fractal Growth Done';

@Injectable()
export class EventsService {

    private readonly _events = new Subject<EventContent>();
    public readonly events = this._events.asObservable();

    public emit<TEventArgs extends EventArgs>(type : EventType, eventArgs : TEventArgs) : void {
        this._events.next({ type, args: eventArgs });
    }
}
