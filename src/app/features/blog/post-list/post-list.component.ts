import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';

interface DbPost {
    date : Date;
    title : string;
    content : string;
}

export interface ViewPost {
    date : string;
    title : string;
    content : string;
}

@Component({
    templateUrl: './post-list.component.html'
})
export class PostListComponent {

    public posts : Observable<ViewPost[]>;

    public title : Observable<string>;
    public description : Observable<string>;

    constructor(
        public afdb : AngularFirestore,
        private route : ActivatedRoute,
    ) {
        this.title = this.route.data.pipe(map(routeData => routeData.title));
        this.description = this.route.data.pipe(map(routeData => routeData.description));

        this.posts = this.route.data.pipe(
            switchMap(routeData =>  this.afdb.collection<DbPost>(routeData.postCollectionName).valueChanges()),
            map(dbPosts => dbPosts.map(dbPost => {
                return {
                    title: dbPost.title,
                    content: dbPost.content,
                    date: moment(dbPost.date).format('DD-MM-YYYY'),
                };
            }))
        );
    }

    //TODO test and see if onDestroy needed?
}
