import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/core/services';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { delay, first, map } from 'rxjs/operators';
import { Post } from '../../models';
import { BlogDataService } from '../../services';

@Component({
  templateUrl: './post-list.component.html',
  styles: [':host { height: 100% }'],
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];

  title: Observable<string>;
  description: Observable<string>;

  hasScroll = new BehaviorSubject<boolean>(false);
  isLoaded = new BehaviorSubject<boolean>(false);

  loadedAll = false;

  constructor(
    private route: ActivatedRoute,
    public blogDataService: BlogDataService,
    public authService: AuthService,
  ) {
    this.title = this.route.data.pipe(map(routeData => routeData.title));
    this.description = this.route.data.pipe(map(routeData => routeData.description));

    this.route.data.pipe(first()).subscribe(routeData => {
      this.blogDataService.postCollectionName.next(routeData.postCollectionName);
    });
  }

  ngOnInit(): void {
    this.blogDataService.initService();

    this.blogDataService.getPosts(5).subscribe(posts => {
      this.posts = posts;
      this.isLoaded.next(true);
    });

    combineLatest(this.isLoaded.pipe(delay(50)), this.hasScroll).subscribe(values => {
      const [isLoaded, hasScroll] = values;
      if (isLoaded && !hasScroll) {
        this.loadMore();
      }
    });
  }

  private loadMore(): void {
    if (this.loadedAll) {
      return;
    }

    this.isLoaded.next(false);

    this.blogDataService.getPosts(3).subscribe(newPosts => {
      if (!newPosts.length) {
        this.loadedAll = true;
      } else {
        this.posts = this.posts.concat(newPosts);
      }
      this.isLoaded.next(true);
    });
  }

  onScrolledBottom(): void {
    this.isLoaded.pipe(first()).subscribe(isLoaded => {
      if (isLoaded) {
        this.loadMore();
      }
    });
  }

  onHasScroll(event: boolean): void {
    this.hasScroll.next(event);
  }
}
