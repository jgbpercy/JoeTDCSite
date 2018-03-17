import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

import { Post } from '../../models';
import { BlogDataService } from '../../services';

@Component({
    templateUrl: './edit-blog.component.html'
})
export class EditBlogComponent implements OnInit {

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
}
