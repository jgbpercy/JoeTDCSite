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
    trigger('stretchInHorizontal', [
        transition(':enter', [
            style({
                height: 0,
                'margin-top': 0,
                'margin-bottom': 0,
            }),
            animate('300ms ease-in-out'),
        ]),
        transition(':leave', [
            animate(
                '300ms ease-in-out',
                style({
                    height: 0,
                    'margin-top': 0,
                    'margin-bottom': 0,
                })
            )
        ])
    ]),
    trigger('fadeIn', [
        transition(':enter', [
            style({
                opacity: 0
            }),
            animate('300ms ease-in-out')
        ]),
        transition(':leave', [
            animate(
                '50ms ease-in-out',
                style({
                    opacity: 0
                })
            )
        ])
    ]),
    trigger('controlsSize', [
        state('big', style({ 'font-size': '4em' })),
        state('small', style({ 'font-size': '2em' })),
        transition(
            'big => small', 
            [
                animate('350ms ease-in-out'),
                query('@fadeIn', [ animateChild() ]),
            ],
        ),
        transition(
            'small => big',
            [
                query('@fadeIn', [ animateChild() ]),
                animate('350ms ease-in-out'),
            ],
        ),
    ]),
],