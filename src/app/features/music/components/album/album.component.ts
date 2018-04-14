import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';

import { Album } from '../../models';

const defaultTrackProgressMessage = 'Choose a track or click below to play';

@Component({
    selector: 'jtdc-album',
    templateUrl: './album.component.html'
})
export class AlbumComponent implements OnInit {

    @Input() public album : Album;

    public activeTrackIndex : number;
    public currentlyPlaying = false;

    public commands : Subject<string>[];

    public playedPercent = 0;
    public playedTime = 0;

    public ngOnInit() : void {

        this.commands = new Array<Subject<string>>();
        
        this.album.tracks.forEach(track => {
            this.commands.push(new Subject<string>());
        });
    }

    public getTrackProgressMessage() : string {

        const playingTrack = this.album.tracks[this.activeTrackIndex];

        if (this.activeTrackIndex === undefined) {
            return defaultTrackProgressMessage;
        }

        const playedTime = moment(new Date(0, 0, 0, 0, 0, this.playedTime)).format('m:ss');

        return `Now playing: ${playingTrack.name} - ${playedTime} / ${playingTrack.duration} `;
    }

    public onTrackPlaying(index : number) : void {

        if (this.activeTrackIndex !== undefined) {
            this.commands[this.activeTrackIndex].next('stop');
        }

        this.activeTrackIndex = index;

        this.currentlyPlaying = true;
    }

    public onTrackPaused(index : number) : void {
        
        this.currentlyPlaying = false;
    }

    public onTrackFinished(index : number) : void {

        if (this.activeTrackIndex === this.album.tracks.length - 1) {
            this.activeTrackIndex = undefined;
            
        } else {
            this.activeTrackIndex += 1;
            this.commands[this.activeTrackIndex].next('play');            
        }
    }

    public onPlayedPercent(percent : number) : void {
        this.playedPercent = percent;
    }

    public clickPause() : void {

        this.commands[this.activeTrackIndex].next('pause');

        this.currentlyPlaying = false;
    }

    public onPlayedTime(time : number) : void {

        this.playedTime = time;
    }

    public clickPlay() : void {

        if (this.activeTrackIndex === undefined) {
            this.activeTrackIndex = 0;
        }

        this.currentlyPlaying = true;
        
        this.commands[this.activeTrackIndex].next('play');
    }

    public clickNext() : void {

        if (this.activeTrackIndex !== undefined) {

            this.commands[this.activeTrackIndex].next('end');
    
            this.activeTrackIndex += 1;
    
            if (this.currentlyPlaying) {
                this.commands[this.activeTrackIndex].next('play');
            }
        }
    }

    public clickPrevious() : void {

        if (this.activeTrackIndex !== undefined) {

            if (this.playedTime < 5 && this.activeTrackIndex > 0) {

                this.commands[this.activeTrackIndex].next('stop');

                this.activeTrackIndex -= 1;

                this.commands[this.activeTrackIndex].next('reset');

                if (this.currentlyPlaying) {
                    this.commands[this.activeTrackIndex].next('play');
                }

            } else {
                this.commands[this.activeTrackIndex].next('reset');
            }
        }
    }

    public onLoadedDuration(index : number, duration : string) {
        
        this.album.tracks[index].duration = duration;
    }
}
