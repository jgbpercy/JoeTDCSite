import { trigger, transition, animate, style } from '@angular/animations';

export const navAnimations = [
  trigger('mobileContentHide', [
    transition(':leave', [
      animate(
        '0.2s 0s ease-in-out',
        style({
          transform: 'translateY(100%)',
          opacity: 0,
        }),
      ),
    ]),
  ]),
  trigger('mobileMenuFadeInOut', [
    transition(':enter', [
      style({
        opacity: 0,
      }),
      animate('0.5s 0.25s ease-in-out'),
    ]),
    transition(':leave', [
      animate(
        '0.5s 0s ease-in-out',
        style({
          opacity: 0,
        }),
      ),
    ]),
  ]),
];
