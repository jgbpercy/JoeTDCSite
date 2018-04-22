import { NgModule } from '@angular/core';
import { SharedModule } from 'shared/shared.module';

import {
    AlbumComponent,
    MusicComponent,
    SingleAlbumPageComponent,
    TrackComponent,
} from './components';
import { MusicRoutingModule } from './music-routing.module';
import { MusicDataService } from './services';

@NgModule({
    imports: [
        SharedModule,
        MusicRoutingModule,
    ],
    declarations: [
        MusicComponent,
        AlbumComponent,
        TrackComponent,
        SingleAlbumPageComponent,
    ],
    providers: [
        MusicDataService,
    ]
})
export class MusicModule { }
