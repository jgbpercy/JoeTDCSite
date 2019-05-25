import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private userId = new BehaviorSubject<string | undefined>(undefined);

  isAdminUser = new BehaviorSubject<boolean>(false);

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(authState => {
      if (authState && authState.uid) {
        this.userId.next(authState.uid);
      } else {
        this.userId.next(undefined);
      }
    });

    this.userId
      .pipe(
        map(userId => {
          return userId === environment.firebaseAdminUid;
        }),
      )
      .subscribe(isAdminUser => this.isAdminUser.next(isAdminUser));
  }
}
