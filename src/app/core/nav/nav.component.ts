import { animate, style, transition, trigger } from '@angular/animations';
import { Component,  } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as fb from 'firebase/app';
import { Observable } from 'rxjs/Observable';

import { WindowSizeService } from '../services/window-size.service';

@Component({
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css'],
    animations: [
        trigger('mobileContentHide', [
            transition(':leave', [
                animate('0.2s 0s ease-in-out',
                    // tslint:disable-next-line:align
                    style({
                        transform: 'translateY(100%)',
                        opacity: 0,
                    })
                )
            ])
        ]),
        trigger('mobileMenuFadeInOut', [
            transition(':enter', [
                style({
                    opacity: 0,
                }),
                animate('0.5s 0.25s ease-in-out')
            ]),
            transition(':leave', [
                animate('0.5s 0s ease-in-out',
                    // tslint:disable-next-line:align
                    style({
                        opacity: 0,
                    })
                )
            ])
        ])
    ]
})
export class NavComponent { 

    public showMobileNav = false;
    public isMobileWidth : Observable<boolean>;
    
    constructor(
        private windowResizeService : WindowSizeService,
        public afAuth : AngularFireAuth,
    ) {
        this.isMobileWidth = this.windowResizeService.isMobileWidth;
    }

    public closeMobileNav() : void {
        this.showMobileNav = false;
    }

    public login() {
        this.afAuth.auth.signInWithRedirect(new fb.auth.GoogleAuthProvider());
    }

    public logout() {
        this.afAuth.auth.signOut();
    }
}
