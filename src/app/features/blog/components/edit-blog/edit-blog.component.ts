import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Post } from '../../models';
import { BlogDataService } from '../../services';

@Component({
  templateUrl: './edit-blog.component.html',
})
export class EditBlogComponent implements OnInit {
  isLoading = false;

  post?: Post;

  constructor(public blogDataService: BlogDataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.pipe(first()).subscribe(routeData => {
      this.blogDataService.postCollectionName.next(routeData.postCollectionName);
    });
  }

  openPost(post?: Post): void {
    this.post = post;
  }

  newPost(): void {
    this.post = new Post();
  }

  onAddPost(idObs: Observable<string>): void {
    forkJoin(idObs, this.blogDataService.allPosts.pipe(first())).subscribe(stream => {
      const [id, posts] = stream;
      this.isLoading = false;
      this.openPost(posts.find(x => x.id === id));
    });
  }

  onDeletePost(): void {
    this.post = undefined;
  }
}
