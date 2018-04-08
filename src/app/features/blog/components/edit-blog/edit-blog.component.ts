import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { take } from 'rxjs/operators';

import { Post } from '../../models';
import { BlogDataService } from '../../services';

@Component({
    templateUrl: './edit-blog.component.html'
})
export class EditBlogComponent implements OnInit {

    public isLoading = false;

    public post : Post;

    constructor(
        public blogDataService : BlogDataService,
        private route : ActivatedRoute,
    ) { }

    public ngOnInit() : void {
        this.route.data.pipe(take(1)).subscribe(
            routeData => {
                this.blogDataService.postCollectionName.next(routeData.postCollectionName);
            }
        );
    }

    public openPost(post : Post) : void {
        this.post = post;
    }

    public newPost() : void {
        this.post = new Post();
    }

    private onAddPost(idObs : Observable<string>) : void {
        this.isLoading = true;

        forkJoin(
            idObs,
            this.blogDataService.allPosts.pipe(take(1)),
            (id, posts) => ({ id, posts }),
        )
        .subscribe(
            stream => {
                this.isLoading = false;
                this.openPost(stream.posts.find(x => x.id === stream.id));
            }
        );
    }

    private onDeletePost() : void {
        this.post = undefined;
    }
}
