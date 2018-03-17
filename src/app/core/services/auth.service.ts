import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators/map';

import { environment } from 'environment';

@Injectable()
export class AuthService {

    private userId = new BehaviorSubject<string>(undefined);

    public isAdminUser = new BehaviorSubject<boolean>(false);
    
    constructor(
        private afAuth : AngularFireAuth,
    ) { 
        this.afAuth.authState.subscribe(
            authState => {
                if (authState && authState.uid) {
                    this.userId.next(authState.uid);
                } else {
                    this.userId.next(undefined);
                }
            }
        );

        this.userId.pipe(
            map(userId => {
                return userId === environment.firebaseAdminUid;
            })
        )
        .subscribe(
            isAdminUser => this.isAdminUser.next(isAdminUser)
        );
    }
}
