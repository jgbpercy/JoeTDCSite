import { NgModule } from '@angular/core';
import { SharedModule } from 'shared/shared.module';

import { AlbumComponent, MusicComponent, TrackComponent } from './components';
import { MusicRoutingModule } from './music-routing.module';

@NgModule({
    imports: [
        SharedModule,
        MusicRoutingModule,
    ],
    declarations: [
        MusicComponent,
        AlbumComponent,
        TrackComponent,
    ]
})
export class MusicModule { }
