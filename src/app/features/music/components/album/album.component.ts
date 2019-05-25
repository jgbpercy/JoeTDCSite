import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { VolumeService } from 'app/features/music/services/volume.service';
import { getDefined } from 'app/shared/utils';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { Album } from '../../models';
import { albumAnimations } from './album.animations';

const defaultTrackProgressMessage = 'Choose a track or click below to play';
const playedColour = '#231C15';
const unplayedColour = '#19140F';
const mouseOverColour = '#56483A';

@Component({
  selector: 'jtdc-album',
  templateUrl: './album.component.html',
  animations: albumAnimations,
})
export class AlbumComponent implements OnInit {
  @Input() showSinglePageLink = false;

  @Input('album') _album?: Album;
  get album(): Album {
    return getDefined(this._album);
  }
  @Input() set albumStopCommands(stopCommands: Observable<void>) {
    stopCommands.subscribe(() => {
      this.stopCommands[getDefined(this.activeTrackIndex)].next();
      this.isActiveAlbum = false;
      this.currentlyPlaying = false;
    });
  }

  @Output() playingAlbum = new EventEmitter<void>();
  @Output() finishedAlbum = new EventEmitter<void>();

  activeTrackIndex?: number;

  private _currentlyPlaying = false;

  set currentlyPlaying(value: boolean) {
    if (value) {
      if (!this.isActiveAlbum) {
        this.playingAlbum.emit();
        this.isActiveAlbum = true;
      }
    }
    this._currentlyPlaying = value;
  }

  get currentlyPlaying(): boolean {
    return this._currentlyPlaying;
  }

  _isActiveAlbum = false;

  set isActiveAlbum(value: boolean) {
    if (value) {
      this.animControlsSize = 'small';
    } else {
      this.animControlsSize = 'big';
    }
    this._isActiveAlbum = value;
  }

  get isActiveAlbum(): boolean {
    return this._isActiveAlbum;
  }

  playCommands = new Array<Subject<void>>();
  stopCommands = new Array<Subject<void>>();
  pauseCommands = new Array<Subject<void>>();
  endCommands = new Array<Subject<void>>();
  timeCommands = new Array<Subject<number>>();

  playedPercent = 0;
  playedTime = 0;

  private mouseOverTrackProgress = false;
  private mouseOverTrackProgressPercent = 0;
  private mouseDownOverTrackProgress = false;

  @ViewChild('trackProgress') set trackProgressElementRef(value: ElementRef) {
    if (value) {
      this.trackProgressElement = value.nativeElement;
    }
  }
  private trackProgressElement?: HTMLElement;

  animControlsSize = 'big';

  volumeLevelHovered = 0;
  volumeControlsOpened = false;
  volumeControlsHovered = false;

  constructor(public volumeService: VolumeService) {}

  ngOnInit(): void {
    this.album.tracks.forEach(track => {
      this.playCommands.push(new Subject<void>());
      this.stopCommands.push(new Subject<void>());
      this.pauseCommands.push(new Subject<void>());
      this.endCommands.push(new Subject<void>());
      this.timeCommands.push(new Subject<number>());
    });
  }

  getTrackProgressMessage(): string {
    if (this.activeTrackIndex === undefined) {
      return defaultTrackProgressMessage;
    }

    const playingTrack = this.album.tracks[this.activeTrackIndex];

    const playedTime = moment(new Date(0, 0, 0, 0, 0, this.playedTime)).format('m:ss');

    const messageStart = this.currentlyPlaying ? 'Now playing' : 'Paused';

    return `${messageStart}: ${playingTrack.name} - ${playedTime} / ${playingTrack.duration} `;
  }

  getTrackProgressBackgroundImage(): string {
    if (!this.mouseOverTrackProgress) {
      return (
        'linear-gradient(to right,' +
        playedColour +
        ', ' +
        playedColour +
        ' ' +
        this.playedPercent +
        '%, ' +
        unplayedColour +
        ' ' +
        this.playedPercent +
        '%, ' +
        unplayedColour +
        ')'
      );
    } else {
      if (this.mouseOverTrackProgressPercent < this.playedPercent) {
        return (
          'linear-gradient(to right,' +
          playedColour +
          ', ' +
          playedColour +
          ' ' +
          (this.mouseOverTrackProgressPercent - 0.5) +
          '%, ' +
          mouseOverColour +
          ' ' +
          this.mouseOverTrackProgressPercent +
          '%, ' +
          playedColour +
          ' ' +
          (this.mouseOverTrackProgressPercent + 0.5) +
          '%, ' +
          playedColour +
          ' ' +
          this.playedPercent +
          '%, ' +
          unplayedColour +
          ' ' +
          this.playedPercent +
          '%, ' +
          unplayedColour +
          ')'
        );
      } else {
        return (
          'linear-gradient(to right,' +
          playedColour +
          ', ' +
          playedColour +
          ' ' +
          this.playedPercent +
          '%, ' +
          unplayedColour +
          ' ' +
          this.playedPercent +
          '%, ' +
          unplayedColour +
          ' ' +
          (this.mouseOverTrackProgressPercent - 0.5) +
          '%, ' +
          mouseOverColour +
          ' ' +
          this.mouseOverTrackProgressPercent +
          '%, ' +
          unplayedColour +
          ' ' +
          (this.mouseOverTrackProgressPercent + 0.5) +
          '%, ' +
          unplayedColour +
          ')'
        );
      }
    }
  }

  onTrackPlaying(index: number): void {
    if (this.activeTrackIndex !== undefined && this.activeTrackIndex !== index) {
      this.stopCommands[this.activeTrackIndex].next();
    }

    this.activeTrackIndex = index;

    this.currentlyPlaying = true;
  }

  onTrackPaused(index: number): void {
    this.currentlyPlaying = false;
  }

  onTrackFinished(index: number): void {
    if (this.activeTrackIndex === this.album.tracks.length - 1) {
      this.onAlbumEnd();
    } else {
      this.activeTrackIndex = getDefined(this.activeTrackIndex) + 1;
      this.playCommands[this.activeTrackIndex].next();
    }
  }

  onPlayedPercent(percent: number): void {
    this.playedPercent = percent;
  }

  clickPause(): void {
    this.pauseCommands[getDefined(this.activeTrackIndex)].next();

    this.currentlyPlaying = false;
  }

  onPlayedTime(time: number): void {
    this.playedTime = time;
  }

  clickPlay(): void {
    if (this.activeTrackIndex === undefined) {
      this.activeTrackIndex = 0;
    }

    this.currentlyPlaying = true;

    this.playCommands[this.activeTrackIndex].next();
  }

  clickNext(): void {
    if (this.activeTrackIndex !== undefined) {
      this.endCommands[this.activeTrackIndex].next();

      if (this.activeTrackIndex === this.album.tracks.length - 1) {
        this.onAlbumEnd();
      } else {
        this.activeTrackIndex += 1;

        if (this.currentlyPlaying) {
          this.playCommands[this.activeTrackIndex].next();
        }
      }
    }
  }

  private onAlbumEnd(): void {
    this.activeTrackIndex = undefined;
    this.currentlyPlaying = false;
    this.isActiveAlbum = false;
    this.finishedAlbum.emit();
  }

  clickPrevious(): void {
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

  onLoadedDuration(index: number, duration: string): void {
    this.album.tracks[index].duration = duration;
  }

  onTrackProgressHover(event: MouseEvent): void {
    this.mouseOverTrackProgress = true;

    const trackProgressBoundingRect = getDefined(this.trackProgressElement).getBoundingClientRect();

    const withinTrackProgressX = event.clientX - trackProgressBoundingRect.left;
    this.mouseOverTrackProgressPercent =
      (withinTrackProgressX / trackProgressBoundingRect.width) * 100;

    if (this.mouseDownOverTrackProgress) {
      this.timeCommands[getDefined(this.activeTrackIndex)].next(this.mouseOverTrackProgressPercent);
    }
  }

  onTrackProgressMouseLeave(): void {
    this.mouseOverTrackProgress = false;
    this.mouseDownOverTrackProgress = false;
  }

  onTrackProgressMouseDown(): void {
    this.mouseDownOverTrackProgress = true;
    this.timeCommands[getDefined(this.activeTrackIndex)].next(this.mouseOverTrackProgressPercent);
  }

  onTrackProgressMouseUp(): void {
    this.mouseDownOverTrackProgress = false;
  }

  onVolLevelMouseOver(volume: number): void {
    this.volumeLevelHovered = volume;
  }

  // tslint:disable-next-line:no-any
  onVolumeMouseEnter(event: any): void {
    if (!event || !event.sourceCapabilities || !event.sourceCapabilities.firesTouchEvents) {
      this.volumeControlsHovered = true;
    }
  }

  onVolumeMouseLeave(): void {
    this.volumeLevelHovered = 0;
    this.volumeControlsHovered = false;
  }

  toggleVolumeControls(): void {
    this.volumeControlsOpened = !this.volumeControlsOpened;
  }

  onVolMinClick(): void {
    if (!this.volumeControlsOpened) {
      this.toggleVolumeControls();
    } else {
      this.volumeService.setVolume(this.volumeService.volumes[0]);
    }
  }
}
