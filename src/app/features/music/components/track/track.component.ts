import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';

import { Track } from '../../models';

@Component({
    selector: 'jtdc-track',
    templateUrl: './track.component.html',
})
export class TrackComponent {

    @Input() public track : Track;

    @Input() public set commands(value : Observable<string>) {

        value.subscribe(
            command => {
                if (command === 'stop') {
                    this.audioElement.pause();
                    this.audioElement.currentTime = 0;
                } else if (command === 'play') {
                    this.audioElement.play();
                } else if (command === 'pause') {
                    this.audioElement.pause();
                } else if (command === 'end') {
                    this.resetNextClick = true;
                    this.audioElement.pause();
                    this.audioElement.currentTime = this.audioElement.duration - 0.1;
                } else if (command === 'reset') {
                    this.audioElement.currentTime = 0;
                }
            }
        );
    }

    @Output() public playTrack = new EventEmitter();
    @Output() public pauseTrack = new EventEmitter();
    @Output() public finishedPlayingTrack = new EventEmitter();
    @Output() public playedPercentOfTrack = new EventEmitter<number>();
    @Output() public playedTime = new EventEmitter<number>();
    @Output() public loadedDuration = new EventEmitter<string>();

    @ViewChild('audioElem') private set audioElementRef(value : ElementRef) {
        this.audioElement = value.nativeElement;
    }
    public audioElement : HTMLAudioElement;

    private resetNextClick = false;

    private set secondsPlayed(value : number) {
        this.timePlayed = moment(new Date(0, 0, 0, 0, 0, value)).format('m:ss');
        this.playedPercent = (value / this.audioElement.duration) * 100;
        this.playedPercentOfTrack.emit(this.playedPercent);
        this.playedTime.emit(value);
    }

    public timePlayed = '0:00';
    public trackTime = '0:00';
    public playedPercent = 0;

    public clicked() {
    
        if (this.audioElement.paused) {

            if (this.resetNextClick) {
                this.audioElement.currentTime = 0;
                this.resetNextClick = false;
            }
            
            this.audioElement.play();
            this.playTrack.emit();

        } else {

            this.audioElement.pause();
            this.pauseTrack.emit();
        }
    }

    public onTrackEnded() {
        this.resetNextClick = true;
        this.finishedPlayingTrack.emit();
    }

    public onTimeUpdate() {
        this.secondsPlayed = this.audioElement.currentTime;
    }

    public onAudioMetadataLoaded() {
        const trackTime = moment(new Date(0, 0, 0, 0, 0, this.audioElement.duration)).format('m:ss');
        this.loadedDuration.emit(trackTime);
    }
}
