import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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

    public playCommands = new Array<Subject<void>>();
    public stopCommands = new Array<Subject<void>>();
    public pauseCommands = new Array<Subject<void>>();
    public endCommands = new Array<Subject<void>>();
    public timeCommands = new Array<Subject<number>>();
    public volumeCommands = new Array<Subject<number>>();

    public playedPercent = 0;
    public playedTime = 0;

    private mouseOverTrackProgress = false;
    private mouseOverTrackProgressPercent = 0;
    private mouseDownOverTrackProgress = false;

    @ViewChild('trackProgress') private set trackProgressElementRef(value : ElementRef) {
        this.trackProgressElement = value.nativeElement;
    }
    private trackProgressElement : HTMLElement;

    public ngOnInit() : void {
        
        this.album.tracks.forEach(track => {
            this.playCommands.push(new Subject<void>());
            this.stopCommands.push(new Subject<void>());
            this.pauseCommands.push(new Subject<void>());
            this.endCommands.push(new Subject<void>());
            this.timeCommands.push(new Subject<number>());
            this.volumeCommands.push(new Subject<number>());
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

    private readonly playedColour = '#231C15';
    private readonly unplayedColour = '#19140F';
    private readonly mouseOverColour = '#786450';

    public getTrackProgressBackgroundImage() : string {
        
        if (!this.mouseOverTrackProgress) {
            return 'linear-gradient(to right,' +
                this.playedColour + ', ' +
                this.playedColour + ' ' + this.playedPercent + '%, ' +
                this.unplayedColour + ' ' + this.playedPercent + '%, ' +
                this.unplayedColour + ')';
        } else {
            if (this.mouseOverTrackProgressPercent < this.playedPercent) {
                return 'linear-gradient(to right,' +
                    this.playedColour + ', ' +
                    this.playedColour + ' ' + (this.mouseOverTrackProgressPercent - 0.5) + '%, ' +
                    this.mouseOverColour + ' ' + this.mouseOverTrackProgressPercent + '%, ' +
                    this.playedColour + ' ' + (this.mouseOverTrackProgressPercent + 0.5) + '%, ' +
                    this.playedColour + ' ' + this.playedPercent + '%, ' +
                    this.unplayedColour + ' ' + this.playedPercent + '%, ' +
                    this.unplayedColour + ')';
            } else {
                return 'linear-gradient(to right,' +
                    this.playedColour + ', ' +
                    this.playedColour + ' ' + this.playedPercent + '%, ' +
                    this.unplayedColour + ' ' + this.playedPercent + '%, ' +
                    this.unplayedColour + ' ' + (this.mouseOverTrackProgressPercent - 0.5) + '%, ' +
                    this.mouseOverColour + ' ' + this.mouseOverTrackProgressPercent + '%, ' +
                    this.unplayedColour + ' ' + (this.mouseOverTrackProgressPercent + 0.5) + '%, ' +
                    this.unplayedColour + ')';
            }
        }
    }

    public onTrackPlaying(index : number) : void {

        if (this.activeTrackIndex !== undefined) {
            this.stopCommands[this.activeTrackIndex].next();
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

            this.currentlyPlaying = false;
            
        } else {
            this.activeTrackIndex += 1;
            this.playCommands[this.activeTrackIndex].next();            
        }
    }

    public onPlayedPercent(percent : number) : void {
        this.playedPercent = percent;
    }

    public clickPause() : void {

        this.pauseCommands[this.activeTrackIndex].next();

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
        
        this.playCommands[this.activeTrackIndex].next();
    }

    public clickNext() : void {

        if (this.activeTrackIndex !== undefined) {

            this.endCommands[this.activeTrackIndex].next();
    
            this.activeTrackIndex += 1;
    
            if (this.currentlyPlaying) {
                this.playCommands[this.activeTrackIndex].next();
            }
        }
    }

    public clickPrevious() : void {

        if (this.activeTrackIndex !== undefined) {

            if (this.playedTime < 5 && this.activeTrackIndex > 0) {

                this.stopCommands[this.activeTrackIndex].next();

                this.activeTrackIndex -= 1;

                this.timeCommands[this.activeTrackIndex].next(0);

                if (this.currentlyPlaying) {
                    this.playCommands[this.activeTrackIndex].next();
                }

            } else {
                this.timeCommands[this.activeTrackIndex].next(0);
            }
        }
    }

    public onLoadedDuration(index : number, duration : string) {
        
        this.album.tracks[index].duration = duration;
    }

    public onTrackProgressHover(event : MouseEvent) : void {

        this.mouseOverTrackProgress = true;

        const withinTrackProgressX = event.clientX - this.trackProgressElement.offsetLeft;
        this.mouseOverTrackProgressPercent = (withinTrackProgressX / this.trackProgressElement.clientWidth) * 100;

        if (this.mouseDownOverTrackProgress) {
            this.timeCommands[this.activeTrackIndex].next(this.mouseOverTrackProgressPercent);
        }
    }

    public onTrackProgressMouseLeave() : void {
        this.mouseOverTrackProgress = false;
        this.mouseDownOverTrackProgress = false;
    }

    public onTrackProgressMouseDown() : void {
        this.mouseDownOverTrackProgress = true;
    }

    public onTrackProgressMouseUp() : void {
        this.mouseDownOverTrackProgress = false;
    }
}