import { Component, OnInit } from '@angular/core';
import { MusicDataService } from 'app/features/music/services';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { Album } from '../../models';

@Component({
    templateUrl: './music.component.html',
    styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit { 

    public isLoading = true;

    public stopCommands = new Array<Subject<void>>();

    private currentlyPlayingAlbumIndex : number;

    constructor(
        private dataService : MusicDataService,
    ) { }

    public albums : Album[];

    public ngOnInit() : void {

        this.dataService.allAlbums.pipe(first()).subscribe(
            albums => {

                this.albums = albums;

                albums.forEach(album => {
                    this.stopCommands.push(new Subject<void>());
                });

                this.isLoading = false;
            }
        );
    }

    public onPlayingAlbum(index : number) {

        if (this.currentlyPlayingAlbumIndex !== undefined) {
            this.stopCommands[this.currentlyPlayingAlbumIndex].next();
        }

        this.currentlyPlayingAlbumIndex = index;
    }

    public onFinishedAlbum() {

        this.currentlyPlayingAlbumIndex = undefined;
    }
}
