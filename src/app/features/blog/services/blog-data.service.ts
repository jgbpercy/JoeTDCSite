import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';

export interface ViewPost {
    date : string;
    title : string;
    content : string;
}

interface DbPost {
    date : Date;
    title : string;
    content : string;
}

@Injectable()
export class BlogDataService {

    public posts : Observable<ViewPost[]>;

    private postCollectionName = new BehaviorSubject<string>('');
    
    constructor(
        private afdb : AngularFirestore,
    ) { 
        this.posts = this.postCollectionName.pipe(
            switchMap(postCollectionName => {
                return this.afdb.collection<DbPost>(postCollectionName).valueChanges();
            }),
            map(dbPosts => dbPosts.map(dbPost => {
                return {
                    title: dbPost.title,
                    content: dbPost.content,
                    date: moment(dbPost.date).format('DD-MM-YYYY'),
                };
            }))
        );
    }

    public setPostCollectionName(postCollectionName : string) {
        this.postCollectionName.next(postCollectionName);
    }
}
