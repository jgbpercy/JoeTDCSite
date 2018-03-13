import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, take } from 'rxjs/operators';

import { BlogDataService, ViewPost } from '../../services/blog-data.service';

@Component({
    templateUrl: './post-list.component.html'
})
export class PostListComponent {

    public posts : Observable<ViewPost[]>;

    public title : Observable<string>;
    public description : Observable<string>;

    constructor(
        private route : ActivatedRoute,
        public blogDataService : BlogDataService,
        public afAuth : AngularFireAuth,
    ) {
        this.title = this.route.data.pipe(map(routeData => routeData.title));
        this.description = this.route.data.pipe(map(routeData => routeData.description));

        this.route.data.pipe(take(1)).subscribe(
            routeData => {
                this.blogDataService.setPostCollectionName(routeData.postCollectionName);
            }
        );
    }
}
