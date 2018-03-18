import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, switchMap, take } from 'rxjs/operators';

import { DbPost, Post } from '../models';
import { BlogDataService } from './blog-data.service';

@Injectable()
export class BlogActionsService {

    constructor(
        private afdb : AngularFirestore,
        private dataService : BlogDataService,
    ) { }

    public savePost(post : DbPost, id : string) : void {
        this.dataService.postCollectionName.pipe(take(1)).subscribe(
            postCollectionName => {
                this.afdb.doc(postCollectionName + '/' + id).update(post);
            }
        );
    }

    public newPost(post : DbPost) : Observable<string> {
        return this.dataService.postCollectionName.pipe(
            take(1),
            switchMap(postCollectionName => {
                return fromPromise(this.afdb.collection(postCollectionName).add(post));
            }),
            map(documentRef => {
                return documentRef.id;
            })
        );
    }

    public deletePost(id : string) : void {
        this.dataService.postCollectionName.pipe(take(1)).subscribe(
            postCollectionName => {
                this.afdb.doc(postCollectionName + '/' + id).delete();
            }
        );
    }
}
