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
                component: HomeComponent,
                data: { navTransparent: true },
            },
            {
                path: 'video-gaem',
                loadChildren: './features/blog/blog.module#BlogModule',
                data: { 
                    postCollectionName: 'GrimoireTDPosts',
                    title: 'Video Gaem',
                    //TODO make this a dynamic component?
                    description: `
                        <p>I started making a game in Unity. This is a place for updates, thoughts, videos and whatever else.</p>
                        <p>It is currently a hex-based tower defence game.</p>
                        <p>
                            <a href="https://github.com/jgbpercy/GrimoireTD" target="_blank">
                                <i class="fab fa-sm fa-github"></i> GitHub
                            </a> - 
                            <a href="https://www.youtube.com/playlist?list=PL1BfrVN5gAzy3q54w1CaRPDoZ95iaPMMF" target="_blank">
                                <i class="fab fa-sm fa-youtube"></i> YouTube
                            </a>
                        </p>
                    `
                },
            },
            {
                path: 'music',
                loadChildren: './features/music/music.module#MusicModule'
            },
            {
                path: 'notepad-txt',
                loadChildren: './features/blog/blog.module#BlogModule',
                data: { 
                    postCollectionName: 'NotepadPosts',
                    title: 'notepad.txt',
                    description: '<p>Because sometimes you have a thought and you want to put it on a website for some reason</p>',
                },
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
            { enableTracing: true }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
