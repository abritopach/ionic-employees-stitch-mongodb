import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ShowPeoplePopoverComponent } from './popovers/show-people.popover';

import { IonicStorageModule } from '@ionic/storage';

import { AgmCoreModule } from '@agm/core';

import { UserProfileModalComponent } from './modals/user-profile-modal/user-profile-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { ProjectsPopoverComponent } from './popovers/projects-popover/projects-popover/projects-popover.component';

@NgModule({
  declarations: [AppComponent, ShowPeoplePopoverComponent, UserProfileModalComponent, ProjectsPopoverComponent],
  entryComponents: [ShowPeoplePopoverComponent, UserProfileModalComponent, ProjectsPopoverComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'apiKey', // Google API key for maps
      libraries: ['places']
    }),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    Ng2ImgMaxModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
