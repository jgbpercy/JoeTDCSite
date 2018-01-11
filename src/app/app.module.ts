import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { FractalAnimationDirective } from './core/fractal-animation/fractal-animation.directive'
import { HomeComponent } from './core/home/home.component'
import { NavComponent } from './core/nav/nav.component'
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component'
import { SharedModule } from './shared/shared.module'

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        PageNotFoundComponent,
        NavComponent,
        FractalAnimationDirective
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
