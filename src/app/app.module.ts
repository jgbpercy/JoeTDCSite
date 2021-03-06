import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import {
    AuthService,
    EventsService,
    LoggerService,
    WindowSizeService,
} from 'core/services';
import { environment } from 'environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FractalAnimationDirective, HomeComponent } from './core/home';
import { NavComponent } from './core/nav/nav.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireAuthModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        PageNotFoundComponent,
        NavComponent,
        FractalAnimationDirective,
    ],
    providers: [
        EventsService,
        WindowSizeService,
        LoggerService,
        AuthService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
