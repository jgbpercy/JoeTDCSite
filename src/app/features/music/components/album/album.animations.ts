import {
    animate,
    animateChild,
    query,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

export const albumAnimations = [
    trigger('trackProgressStretchIn', [

        transition(':enter', [
            style({
                height: 0,
                'margin-top': 0,
                'margin-bottom': 0,
            }),
            animate('300ms ease-in-out'),
            query('@trackProgressMessageFade', [ animateChild() ]),
        ]),

        transition(':leave', [
            query('@trackProgressMessageFade', [ animateChild() ]),
            animate(
                '300ms ease-in-out',
                style({
                    height: 0,
                    'margin-top': 0,
                    'margin-bottom': 0,
                }),
            ),
        ]),
    ]),

    trigger('trackProgressMessageFade', [

        transition(':enter', [ 
            style({ opacity: 0 }),
            animate('300ms ease-in-out'),
        ]),

        transition(':leave', [
            animate(
                '50ms ease-in-out',
                style({ opacity: 0 })
            ),
        ]),
    ]),

    trigger('playControlsFade', [

        transition(':enter', [ 
            style({ opacity: 0 }),
            animate('300ms ease-in-out'),
        ]),

        transition(':leave', [
            animate(
                '50ms ease-in-out',
                style({ opacity: 0 })
            ),
        ]),
    ]),

    trigger('volumeControlsFade', [
        transition(':enter', [ 
            style({ 
                opacity: 0,
                width: 0,
            }),
            animate('300ms 200ms ease-in-out'),
        ]),

        transition(':leave', [
            animate(
                '200ms ease-in-out',
                style({
                    opacity: 0,
                    width: 0,
                })
            ),
        ]),
    ]),
    
    trigger('playControlsSize', [

        state('big', style({ 'font-size': '4em' })),

        state('small', style({ 'font-size': '*' })),

        transition('big => small', [
            animate('350ms ease-in-out'),
            query('@playControlsFade', [ animateChild() ]),
        ]),

        transition('small => big', [
            query('@playControlsFade', [ animateChild() ]),
            animate('350ms ease-in-out'),
        ]),
    ]),
];
