import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { environment } from '../environments/environment.prod';
import { firebaseApiKeyDev } from '../environments/firebase-api-key-dev';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FractalAnimationDirective, HomeComponent } from './core/home';
import { HomeEventsService } from './core/home/services/home-events.service';
import { NavComponent } from './core/nav/nav.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { LoggerService } from './core/services/logger.service';
import { WindowSizeService } from './core/services/window-size.service';
import { SharedModule } from './shared/shared.module';

const firebaseConfig = Object.assign({}, environment.firebase, { apiKey: firebaseApiKeyDev });

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(firebaseConfig),
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
        HomeEventsService,
        WindowSizeService,
        LoggerService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
