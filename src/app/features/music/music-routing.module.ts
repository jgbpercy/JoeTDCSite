import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MusicComponent, SingleAlbumPageComponent } from './components';

const routes : Routes = [
    {
        path: '',
        component: MusicComponent,
    },
    {
        path: 'album/:albumId',
        component: SingleAlbumPageComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MusicRoutingModule { }
