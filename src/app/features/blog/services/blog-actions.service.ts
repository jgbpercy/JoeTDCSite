import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { DbPost } from '../models';
import { BlogDataService } from './blog-data.service';

@Injectable()
export class BlogActionsService {
  constructor(private afdb: AngularFirestore, private dataService: BlogDataService) {}

  savePost(post: DbPost, id: string): void {
    this.dataService.postCollectionName.pipe(take(1)).subscribe(postCollectionName => {
      this.afdb.doc(postCollectionName + '/' + id).update(post);
    });
  }

  newPost(post: DbPost): Observable<string> {
    return this.dataService.postCollectionName.pipe(
      take(1),
      switchMap(postCollectionName => {
        return from(this.afdb.collection(postCollectionName).add(post));
      }),
      map(documentRef => {
        return documentRef.id;
      }),
    );
  }

  deletePost(id: string): void {
    this.dataService.postCollectionName.pipe(take(1)).subscribe(postCollectionName => {
      this.afdb.doc(postCollectionName + '/' + id).delete();
    });
  }
}
