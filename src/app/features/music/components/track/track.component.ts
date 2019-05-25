import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { VolumeService } from 'app/features/music/services';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Track } from '../../models';
import { getDefined } from 'app/shared/utils';

@Component({
  selector: 'jtdc-track',
  templateUrl: './track.component.html',
})
export class TrackComponent {
  @Input() track?: Track;

  @Input() set playCommands(playCommands: Observable<void>) {
    playCommands.subscribe(command => {
      if (this.resetNextPlay) {
        this.audioElement.currentTime = 0;
        this.resetNextPlay = false;
      }
      this.audioElement.play();
    });
  }

  @Input() set stopCommands(stopCommands: Observable<void>) {
    stopCommands.subscribe(command => {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    });
  }

  @Input() set pauseCommands(pauseCommands: Observable<void>) {
    pauseCommands.subscribe(command => {
      this.audioElement.pause();
    });
  }

  @Input() set endCommands(endCommands: Observable<void>) {
    endCommands.subscribe(command => {
      this.resetNextPlay = true;
      this.audioElement.pause();
      this.audioElement.currentTime = this.audioElement.duration - 0.1;
    });
  }

  @Input() set timeCommands(timeCommands: Observable<number>) {
    timeCommands.subscribe(timeInPercent => {
      this.audioElement.currentTime = (timeInPercent / 100) * this.audioElement.duration;
    });
  }

  @Output() playTrack = new EventEmitter();
  @Output() pauseTrack = new EventEmitter();
  @Output() finishedPlayingTrack = new EventEmitter();
  @Output() playedPercentOfTrack = new EventEmitter<number>();
  @Output() playedTime = new EventEmitter<number>();
  @Output() loadedDuration = new EventEmitter<string>();

  @ViewChild('audioElem') private set audioElementRef(value: ElementRef) {
    this._audioElement = value.nativeElement;
    this.volumeService.volume.pipe(first()).subscribe(volume => {
      this.audioElement.volume = volume;
    });
  }
  _audioElement?: HTMLAudioElement;
  get audioElement(): HTMLAudioElement {
    return getDefined(this._audioElement);
  }

  private resetNextPlay = false;

  private set secondsPlayed(value: number) {
    this.timePlayed = moment(new Date(0, 0, 0, 0, 0, value)).format('m:ss');
    this.playedPercent = (value / this.audioElement.duration) * 100;
    this.playedPercentOfTrack.emit(this.playedPercent);
    this.playedTime.emit(value);
  }

  timePlayed = '0:00';
  trackTime = '0:00';
  playedPercent = 0;

  constructor(private volumeService: VolumeService) {
    this.volumeService.volume.subscribe(volume => {
      if (this.audioElement) {
        this.audioElement.volume = volume;
      }
    });
  }

  clicked(): void {
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

  onTrackEnded(): void {
    this.resetNextPlay = true;
    this.finishedPlayingTrack.emit();
  }

  onTimeUpdate(): void {
    this.secondsPlayed = this.audioElement.currentTime;
  }

  onAudioMetadataLoaded(): void {
    const trackTime = moment(new Date(0, 0, 0, 0, 0, this.audioElement.duration)).format('m:ss');
    this.loadedDuration.emit(trackTime);
  }
}
