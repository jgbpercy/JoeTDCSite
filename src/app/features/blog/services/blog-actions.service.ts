import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { DbPost, Post } from '../models';

import { BlogDataService } from './blog-data.service';

@Injectable()
export class BlogActionsService {

    constructor(
        private afdb : AngularFirestore,
        private dataService : BlogDataService,
    ) { }

    public savePost(post : DbPost, id : string) : void {
        this.dataService.postCollectionName.subscribe(
            postCollectionName => {
                this.afdb.doc(postCollectionName + '/' + id).update(post);
            }
        );
    }
}
