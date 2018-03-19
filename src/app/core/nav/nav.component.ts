import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as fb from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { filter, map } from 'rxjs/operators';

import { WindowSizeService } from '../services/window-size.service';

@Component({
    templateUrl: './nav.component.html',
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
    public navTransparent : boolean;
    
    constructor(
        private windowResizeService : WindowSizeService,
        public afAuth : AngularFireAuth,
        public router : Router,
    ) {
        this.isMobileWidth = this.windowResizeService.isMobileWidth;

        this.router.events.pipe(
            filter<ActivationEnd>(event => event instanceof ActivationEnd),
            filter(event => event.snapshot.url.length > 0),
            map(routerEvent => {
                return routerEvent.snapshot.data.navTransparent;
            }),
        )
        .subscribe(
            navTransparent => {
                this.navTransparent = navTransparent;
            }
        );
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
