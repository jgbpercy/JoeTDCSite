import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { NavComponent } from './core/nav/nav.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';

const routes : Routes = [
    {
        path: '',
        component: NavComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'video-gaem',
                loadChildren: './features/blog/blog.module#BlogModule'
            },
            {
                path: 'music',
                loadChildren: './features/music/music.module#MusicModule'
            },
            {
                path: 'notepad-txt',
                loadChildren: './features/blog/blog.module#BlogModule'
            },
            {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full'
            },
            {
                path: '**',
                component: PageNotFoundComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            { enableTracing: false }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
