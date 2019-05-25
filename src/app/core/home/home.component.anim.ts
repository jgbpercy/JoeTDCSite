import { trigger, transition, style, animate } from '@angular/animations';

export const homeAnimations = [
  trigger('wotContentIsShown', [
    transition(':enter', [
      style({
        left: 'calc(50% + 80px)',
        opacity: 0,
      }),
      animate('0.2s 0.25s ease-in-out'),
    ]),
    transition(':leave', [
      animate(
        '0.2s 0s ease-in-out',
        style({
          left: 'calc(50% + 80px)',
          opacity: 0,
        }),
      ),
    ]),
  ]),
  trigger('whoContentIsShown', [
    transition(':enter', [
      style({
        left: 'calc(50% - 380px)',
        opacity: 0,
      }),
      animate('0.2s 0.25s ease-in-out'),
    ]),
    transition(':leave', [
      animate(
        '0.2s 0s ease-in-out',
        style({
          left: 'calc(50% - 380px)',
          opacity: 0,
        }),
      ),
    ]),
  ]),
];
