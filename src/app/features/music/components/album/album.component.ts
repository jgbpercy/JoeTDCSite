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

    @Input() public showSinglePageLink : boolean;

    @Input() public album : Album;
    @Input() public set albumStopCommands(stopCommands : Observable<void>) {
        stopCommands.subscribe(
            command => {
                this.stopCommands[this.activeTrackIndex].next();
                this.isActiveAlbum = false;
                this.currentlyPlaying = false;
            }
        );
    } 

    @Output() public playingAlbum = new EventEmitter<void>();
    @Output() public finishedAlbum = new EventEmitter<void>(); 

    public activeTrackIndex : number;

    private _currentlyPlaying = false;

    public set currentlyPlaying(value : boolean) {
        if (value) {
            if (!this.isActiveAlbum) {
                this.playingAlbum.emit();
                this.isActiveAlbum = true;
            }
        }
        this._currentlyPlaying = value;
    }

    public get currentlyPlaying() : boolean {
        return this._currentlyPlaying;
    } 

    public _isActiveAlbum = false;
    
    public set isActiveAlbum(value : boolean) {
        if (value) {
            this.animControlsSize = 'small';
        } else {
            this.animControlsSize = 'big';
        }
        this._isActiveAlbum = value;
    }

    public get isActiveAlbum() : boolean {
        return this._isActiveAlbum;
    }

    public playCommands = new Array<Subject<void>>();
    public stopCommands = new Array<Subject<void>>();
    public pauseCommands = new Array<Subject<void>>();
    public endCommands = new Array<Subject<void>>();
    public timeCommands = new Array<Subject<number>>();

    public playedPercent = 0;
    public playedTime = 0;

    private mouseOverTrackProgress = false;
    private mouseOverTrackProgressPercent = 0;
    private mouseDownOverTrackProgress = false;

    @ViewChild('trackProgress') private set trackProgressElementRef(value : ElementRef) {
        if (value) {
            this.trackProgressElement = value.nativeElement;
        }
    }
    private trackProgressElement : HTMLElement;

    public animControlsSize = 'big';

    public volumeLevelHovered = 0;
    public volumeControlsOpened = false;
    public volumeControlsHovered = false;

    constructor(public volumeService : VolumeService) { }

    public ngOnInit() : void {
        
        this.album.tracks.forEach(track => {
            this.playCommands.push(new Subject<void>());
            this.stopCommands.push(new Subject<void>());
            this.pauseCommands.push(new Subject<void>());
            this.endCommands.push(new Subject<void>());
            this.timeCommands.push(new Subject<number>());
        });
    }

    public getTrackProgressMessage() : string {

        const playingTrack = this.album.tracks[this.activeTrackIndex];

        if (this.activeTrackIndex === undefined) {
            return defaultTrackProgressMessage;
        }

        const playedTime = moment(new Date(0, 0, 0, 0, 0, this.playedTime)).format('m:ss');

        const messageStart = this.currentlyPlaying ? 'Now playing' : 'Paused';

        return `${messageStart}: ${playingTrack.name} - ${playedTime} / ${playingTrack.duration} `;
    }

    public getTrackProgressBackgroundImage() : string {
        
        if (!this.mouseOverTrackProgress) {
            return 'linear-gradient(to right,' +
                playedColour + ', ' +
                playedColour + ' ' + this.playedPercent + '%, ' +
                unplayedColour + ' ' + this.playedPercent + '%, ' +
                unplayedColour + ')';
        } else {
            if (this.mouseOverTrackProgressPercent < this.playedPercent) {
                return 'linear-gradient(to right,' +
                    playedColour + ', ' +
                    playedColour + ' ' + (this.mouseOverTrackProgressPercent - 0.5) + '%, ' +
                    mouseOverColour + ' ' + this.mouseOverTrackProgressPercent + '%, ' +
                    playedColour + ' ' + (this.mouseOverTrackProgressPercent + 0.5) + '%, ' +
                    playedColour + ' ' + this.playedPercent + '%, ' +
                    unplayedColour + ' ' + this.playedPercent + '%, ' +
                    unplayedColour + ')';
            } else {
                return 'linear-gradient(to right,' +
                    playedColour + ', ' +
                    playedColour + ' ' + this.playedPercent + '%, ' +
                    unplayedColour + ' ' + this.playedPercent + '%, ' +
                    unplayedColour + ' ' + (this.mouseOverTrackProgressPercent - 0.5) + '%, ' +
                    mouseOverColour + ' ' + this.mouseOverTrackProgressPercent + '%, ' +
                    unplayedColour + ' ' + (this.mouseOverTrackProgressPercent + 0.5) + '%, ' +
                    unplayedColour + ')';
            }
        }
    }

    public onTrackPlaying(index : number) : void {

        if (this.activeTrackIndex !== undefined && this.activeTrackIndex !== index) {
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
            
            this.onAlbumEnd();
            
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

    private onAlbumEnd() {
        
        this.activeTrackIndex = undefined;
        this.currentlyPlaying = false;
        this.isActiveAlbum = false;
        this.finishedAlbum.emit();
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
        
        const trackProgressBoundingRect = this.trackProgressElement.getBoundingClientRect();

        const withinTrackProgressX = event.clientX - trackProgressBoundingRect.left;
        this.mouseOverTrackProgressPercent = (withinTrackProgressX / trackProgressBoundingRect.width) * 100;

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
        this.timeCommands[this.activeTrackIndex].next(this.mouseOverTrackProgressPercent);
    }

    public onTrackProgressMouseUp() : void {
        this.mouseDownOverTrackProgress = false;
    }

    public onVolLevelMouseOver(volume : number) : void {
        this.volumeLevelHovered = volume;
    }

    // tslint:disable-next-line:no-any
    public onVolumeMouseEnter(event : any) : void {
        if (!event || !event.sourceCapabilities || !event.sourceCapabilities.firesTouchEvents) {
            this.volumeControlsHovered = true;
        }
    }

    public onVolumeMouseLeave() : void {
        this.volumeLevelHovered = 0;
        this.volumeControlsHovered = false;
    }

    public toggleVolumeControls() : void {
        this.volumeControlsOpened = !this.volumeControlsOpened;
    }

    public onVolMinClick() : void {
        if (!this.volumeControlsOpened) {
            this.toggleVolumeControls();
        } else {
            this.volumeService.setVolume(this.volumeService.volumes[0]);
        }
    }
}
