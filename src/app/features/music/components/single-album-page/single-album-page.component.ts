import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getNonNull } from 'app/shared/utils';
import { switchMap } from 'rxjs/operators';
import { Album } from '../../models';
import { MusicDataService } from '../../services';

@Component({
  templateUrl: './single-album-page.component.html',
})
export class SingleAlbumPageComponent implements OnInit {
  constructor(private dataService: MusicDataService, private activatedRoute: ActivatedRoute) {}

  album?: Album;

  isLoading = true;

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        switchMap(paramMap => {
          return this.dataService.getAlbum(getNonNull(paramMap.get('albumId')));
        }),
      )
      .subscribe(album => {
        this.album = album;
        this.isLoading = false;
      });
  }
}
