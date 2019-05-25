import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'app/features/blog/models';
import { BlogDataService } from 'app/features/blog/services';
import { first, map, switchMap } from 'rxjs/operators';
import { getNonNull } from 'app/shared/utils';

@Component({
  templateUrl: './single-post-page.component.html',
})
export class SinglePostPageComponent {
  isLoading = true;

  post?: Post;

  constructor(
    private dataService: BlogDataService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.data.pipe(first()).subscribe(routeData => {
      this.dataService.postCollectionName.next(routeData.postCollectionName);
    });

    this.route.paramMap
      .pipe(
        map(paramMap => getNonNull(paramMap.get('postId'))),
        switchMap(postId => this.dataService.getPost(postId)),
      )
      .subscribe(post => {
        this.isLoading = false;
        this.post = post;
      });
  }

  back(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
