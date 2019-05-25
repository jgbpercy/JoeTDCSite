import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivationEnd, Router } from '@angular/router';
import * as fb from 'firebase/app';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { WindowSizeService } from '../services/window-size.service';
import { navAnimations } from './nav.anim';

@Component({
  templateUrl: './nav.component.html',
  animations: navAnimations,
  styles: [':host { height: 100% }'],
})
export class NavComponent {
  showMobileNav = false;
  isMobileWidth: Observable<boolean>;
  navTransparent?: boolean;

  constructor(
    private windowResizeService: WindowSizeService,
    public afAuth: AngularFireAuth,
    public router: Router,
  ) {
    this.isMobileWidth = this.windowResizeService.isMobileWidth;

    this.router.events
      .pipe(
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter(event => event.snapshot.url.length > 0),
        map((routerEvent: ActivationEnd) => routerEvent.snapshot.data.navTransparent),
      )
      .subscribe(navTransparent => {
        this.navTransparent = navTransparent;
      });
  }

  closeMobileNav(): void {
    this.showMobileNav = false;
  }

  login(): void {
    this.afAuth.auth.signInWithRedirect(new fb.auth.GoogleAuthProvider());
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}
