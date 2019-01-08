import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SchedulePage } from './schedule.page';

import { AgmCoreModule } from '@agm/core';

import { EventModalComponent } from './../modals/event-modal/event.modal';

import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: SchedulePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDB9__kjPlloGKBm6moXS9hrRbmJ4-gXXc' // Google API key for maps
    }),
    NgSelectModule
  ],
  declarations: [SchedulePage, EventModalComponent],
  entryComponents: [EventModalComponent]
})
export class SchedulePageModule {}
