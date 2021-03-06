import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { VolumeService } from 'app/features/music/services';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Track } from '../../models';

@Component({
    selector: 'jtdc-track',
    templateUrl: './track.component.html',
})
export class TrackComponent {

    @Input() public track : Track;

    @Input() public set playCommands(playCommands : Observable<void>) {
        playCommands.subscribe(
            command => {
                if (this.resetNextPlay) {
                    this.audioElement.currentTime = 0;
                    this.resetNextPlay = false;
                }
                this.audioElement.play();
            }
        );
    }

    @Input() public set stopCommands(stopCommands : Observable<void>) {
        stopCommands.subscribe(
            command => {
                this.audioElement.pause();
                this.audioElement.currentTime = 0;
            }
        );
    }

    @Input() public set pauseCommands(pauseCommands : Observable<void>) {
        pauseCommands.subscribe(
            command => {
                this.audioElement.pause();
            }
        );
    }

    @Input() public set endCommands(endCommands : Observable<void>) {
        endCommands.subscribe(
            command => {
                this.resetNextPlay = true;
                this.audioElement.pause();
                this.audioElement.currentTime = this.audioElement.duration - 0.1;
            }
        );
    }
    
    @Input() public set timeCommands(timeCommands : Observable<number>) {
        timeCommands.subscribe(
            timeInPercent => {
                this.audioElement.currentTime = (timeInPercent / 100) * this.audioElement.duration;
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
        this.volumeService.volume.pipe(first()).subscribe(
            volume => {
                this.audioElement.volume = volume;
            }
        );
    }
    public audioElement : HTMLAudioElement;

    private resetNextPlay = false;

    private set secondsPlayed(value : number) {
        this.timePlayed = moment(new Date(0, 0, 0, 0, 0, value)).format('m:ss');
        this.playedPercent = (value / this.audioElement.duration) * 100;
        this.playedPercentOfTrack.emit(this.playedPercent);
        this.playedTime.emit(value);
    }

    public timePlayed = '0:00';
    public trackTime = '0:00';
    public playedPercent = 0;

    constructor(private volumeService : VolumeService) { 
        this.volumeService.volume.subscribe(
            volume => {
                if (this.audioElement) {
                    this.audioElement.volume = volume;
                }
            }
        );
    }

    public clicked() {
    
        if (this.audioElement.paused) {

            if (this.resetNextPlay) {
                this.audioElement.currentTime = 0;
                this.resetNextPlay = false;
            }
            
            this.audioElement.play();
            this.playTrack.emit();

        } else {

            this.audioElement.pause();
            this.pauseTrack.emit();
        }
    }

    public onTrackEnded() {
        this.resetNextPlay = true;
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
