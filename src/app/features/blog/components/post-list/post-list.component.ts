import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, take } from 'rxjs/operators';

import { AuthService } from 'app/core/services';
import { Post } from '../../models';
import { BlogDataService } from '../../services';

@Component({
    templateUrl: './post-list.component.html'
})
export class PostListComponent {

    public posts : Observable<Post[]>;

    public title : Observable<string>;
    public description : Observable<string>;

    constructor(
        private route : ActivatedRoute,
        public blogDataService : BlogDataService,
        public authService : AuthService,
    ) {
        this.title = this.route.data.pipe(map(routeData => routeData.title));
        this.description = this.route.data.pipe(map(routeData => routeData.description));

        this.route.data.pipe(take(1)).subscribe(
            routeData => {
                this.blogDataService.postCollectionName.next(routeData.postCollectionName);
            }
        );
    }
}
