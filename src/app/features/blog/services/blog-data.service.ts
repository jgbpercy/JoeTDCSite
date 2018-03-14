import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { DbPost, Post } from '../models';

@Injectable()
export class BlogDataService {

    public posts : Observable<Post[]>;

    public postCollectionName = new BehaviorSubject<string>('');
    
    constructor(
        private afdb : AngularFirestore,
    ) { 
        this.posts = this.postCollectionName.pipe(
            distinctUntilChanged(),
            switchMap(postCollectionName => {
                return this.afdb.collection<DbPost>(postCollectionName).snapshotChanges();
            }),
            map(dbData => dbData.map(dbSnapShot => {
                const dbPost = dbSnapShot.payload.doc.data() as DbPost;
                return new Post(
                    dbSnapShot.payload.doc.id,
                    dbPost.title,
                    dbPost.date,
                    dbPost.content,
                );
            }))
        );
    }
}
