import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, QueryFn } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, map, switchMap, take, tap } from 'rxjs/operators';

import { DbPost, Post } from '../models';

@Injectable()
export class BlogDataService {

    public allPosts : Observable<Post[]>;

    public postCollectionName = new BehaviorSubject<string>('');

    public lastLoaded; //type = DocumentSnapshot but firestore-types is playing up
    
    constructor(
        private afdb : AngularFirestore,
    ) { 
        this.allPosts = this.postCollectionName.pipe(
            distinctUntilChanged(),
            switchMap(postCollectionName => {
                return this.afdb.collection<DbPost>(
                    postCollectionName,
                    posts => posts.orderBy('date', 'desc')
                ).snapshotChanges();
            }),
            map(BlogDataService.mapDocumentChangeActionsToPosts)
        );
    }

    public initService() : void {
        this.lastLoaded = undefined;
    }

    public getPosts(numberOfPosts : number) : Observable<Post[]> {
        return this.postCollectionName.pipe(
            switchMap(postCollectionName => {
                let queryFn : QueryFn;
                if (this.lastLoaded) {
                    queryFn = posts => posts
                        .orderBy('date', 'desc')
                        .limit(numberOfPosts)
                        .startAfter(this.lastLoaded);
                } else {
                    queryFn = posts => posts
                        .orderBy('date', 'desc')
                        .limit(numberOfPosts);
                }
                return this.afdb.collection<DbPost>(postCollectionName, queryFn).snapshotChanges();
            }),
            tap(changeActions => {
                if (changeActions.length) {
                    this.lastLoaded = changeActions[changeActions.length - 1].payload.doc;
                }
            }),
            map(BlogDataService.mapDocumentChangeActionsToPosts),
            take(1),
        );
    }

    private static mapDocumentChangeActionsToPosts(documentChangeActions : DocumentChangeAction[]) : Post[] {
        return documentChangeActions.map(changeAction => {
            const dbPost = changeAction.payload.doc.data() as DbPost;
            return new Post(
                changeAction.payload.doc.id,
                dbPost.title,
                dbPost.date,
                dbPost.content,
            );
        });
    }
}
