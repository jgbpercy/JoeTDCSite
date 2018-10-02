import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, QueryFn } from 'angularfire2/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, take, tap } from 'rxjs/operators';

import { DbPost, Post } from '../models';

@Injectable()
export class BlogDataService {

    public allPosts : Observable<Post[]>;

    public postCollectionName = new BehaviorSubject<string>('');

    public lastLoaded; //type = DocumentSnapshot but firestore-types is playing up - TODO: can this be resolved now packages are updated?
    
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

    public getPost(id : string) : Observable<Post> {
        return this.postCollectionName.pipe(
            switchMap(postCollectionName => {
                return this.afdb.collection(postCollectionName).doc<DbPost>(id).snapshotChanges();
            }),
            map(ds => {
                const dbPost = ds.payload.data();
                return new Post(
                    dbPost.title,
                    dbPost.date,
                    dbPost.content,
                    ds.payload.id,
                );
            }),
            take(1),
        );
    }

    private static mapDocumentChangeActionsToPosts(documentChangeActions : DocumentChangeAction<DbPost>[]) : Post[] {
        return documentChangeActions.map(dca => {
            const dbPost = dca.payload.doc.data();
            return new Post(
                dbPost.title,
                dbPost.date,
                dbPost.content,
                dca.payload.doc.id,
            );
        });
    }
 }
