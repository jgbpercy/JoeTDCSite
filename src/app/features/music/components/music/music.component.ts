import { Component } from '@angular/core';

import { Album } from '../../models';

@Component({
    templateUrl: './music.component.html',
    styleUrls: ['./music.component.css']
})
export class MusicComponent { 

    public albums : Album[] = [
        {
            name: 'IBFAWTOSIG',
            description: 'JoeTDC - Spring 2016',
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
    ];
}
