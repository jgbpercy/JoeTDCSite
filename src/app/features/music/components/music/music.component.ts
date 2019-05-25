import { Component, OnInit } from '@angular/core';
import { MusicDataService } from 'app/features/music/services';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Album } from '../../models';

@Component({
  templateUrl: './music.component.html',
})
export class MusicComponent implements OnInit {
  isLoading = true;

  stopCommands = new Array<Subject<void>>();

  private currentlyPlayingAlbumIndex?: number;

  constructor(private dataService: MusicDataService) {}

  albums?: Album[];

  ngOnInit(): void {
    this.dataService.allAlbums.pipe(first()).subscribe(albums => {
      this.albums = albums;

      albums.forEach(album => {
        this.stopCommands.push(new Subject<void>());
      });

      this.isLoading = false;
    });
  }

  onPlayingAlbum(index: number): void {
    if (this.currentlyPlayingAlbumIndex !== undefined) {
      this.stopCommands[this.currentlyPlayingAlbumIndex].next();
    }

    this.currentlyPlayingAlbumIndex = index;
  }

  onFinishedAlbum(): void {
    this.currentlyPlayingAlbumIndex = undefined;
  }
}
