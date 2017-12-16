import { NgModule } from '@angular/core'

import { SharedModule } from '../../shared/shared.module'
import { MusicRoutingModule } from './music-routing.module'
import { MusicComponent } from './music/music.component'

@NgModule({
    imports: [
        SharedModule,
        MusicRoutingModule
    ],
    declarations: [
        MusicComponent
    ]
})
export class MusicModule { }
