import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService, EventsService, LoggerService, WindowSizeService } from 'core/services';
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
  providers: [EventsService, WindowSizeService, LoggerService, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
