import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { Album } from '../../models';

@Component({
    templateUrl: './music.component.html',
    styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit { 

    public stopCommands = new Array<Subject<void>>();

    private currentlyPlayingAlbumIndex : number;
    
    public albums : Album[] = [
        {
            name: 'IBFAWTOSIG',
            description: 'JoeTDC - Spring 2016',
            // tslint:disable-next-line:max-line-length
            artSrc: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/image1.JPG?alt=media&token=53843ebe-c6cc-4cac-b7d8-2472b93d70e4',
            tracks: [
                {
                    name: 'Clrown',
                    // tslint:disable-next-line:max-line-length
                    src: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/Clrown.mp3?alt=media&token=997b7a72-5768-4cea-b1fa-e57c1e2d1ac7',
                },
                {
                    name: 'Summary',
                    // tslint:disable-next-line:max-line-length
                    src: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/Summary.mp3?alt=media&token=fa4372d4-4705-4d2a-b0f9-e89841f1da50',
                },
                {
                    name: 'Ian Music: Musician',
                    // tslint:disable-next-line:max-line-length
                    src: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/Ian%20Music%20Musician.mp3?alt=media&token=85db6291-3944-40b8-97bd-68325101683d',
                },
                {
                    name: 'He Can Have Hers',
                    // tslint:disable-next-line:max-line-length
                    src: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/He%20Can%20Have%20Hers.mp3?alt=media&token=5088706e-9c19-4b2b-a862-b2b8fb74418b',
                },
                {
                    name: 'Don\'t Have Sound Plan',
                    // tslint:disable-next-line:max-line-length
                    src: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/Don\'t%20Have%20Sound%20Plan.mp3?alt=media&token=a97f71a4-21aa-48d1-8754-dad01ad3de95',
                },
            ],
        },        
        {
            name: 'B-Sides and Seasides',
            description: 'IBFAWTOSIG Offcuts',
            // tslint:disable-next-line:max-line-length
            artSrc: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/seaside-5-1467410-1600x1200.jpg?alt=media&token=f63cd290-6f6c-4304-8109-fe721a630ba0',
            tracks: [
                {
                    name: 'Fortunate Tale',
                    // tslint:disable-next-line:max-line-length
                    src: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/Fortunate%20Tale.mp3?alt=media&token=da476949-33ad-4b1d-ab0a-5f280f11da60',
                },
                {
                    name: 'Isomurphy',
                    // tslint:disable-next-line:max-line-length
                    src: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/Isomurphy.mp3?alt=media&token=a83c0ee0-9a83-47c6-91e8-f6bccb41bcbf',
                },
                {
                    name: 'Metric Place',
                    // tslint:disable-next-line:max-line-length
                    src: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/Metric%20Place.mp3?alt=media&token=af00db7c-b560-4cd4-8bdf-a058547e5395',
                },
                {
                    name: 'Electronic Junk',
                    // tslint:disable-next-line:max-line-length
                    src: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/Electronic%20Junk.mp3?alt=media&token=38efe71a-7e13-4c9f-aa5a-28137c3770a8',
                },
                {
                    name: 'The Very Best of Acou Stic',
                    // tslint:disable-next-line:max-line-length
                    src: 'https://firebasestorage.googleapis.com/v0/b/joetdc-site-dev.appspot.com/o/The%20Very%20Best%20of%20Acou%20Stic.mp3?alt=media&token=b15e9a76-8af0-4c56-83c4-73b78893e2a9',
                },
            ],
        },
    ];

    public ngOnInit() : void {

        this.albums.forEach(album => {
            this.stopCommands.push(new Subject<void>());
        });
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
