import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FractalAnimationDirective, HomeComponent } from './core/home';
import { HomeEventsService } from './core/home/services/home-events.service';
import { NavComponent } from './core/nav/nav.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { LoggerService } from './core/services/logger.service';
import { WindowSizeService } from './core/services/window-size.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
        AppRoutingModule,
        BrowserAnimationsModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        PageNotFoundComponent,
        NavComponent,
        FractalAnimationDirective,
    ],
    providers: [
        HomeEventsService,
        WindowSizeService,
        LoggerService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
