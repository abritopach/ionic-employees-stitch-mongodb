import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HolidaysPage } from './holidays.page';

import { SharedComponentsModule } from '../components/shared-components.module';
import { RequestHolidaysModalComponent } from '../modals/request-holidays-modal/request-holidays-modal.component';
import { HistoryHolidaysModalComponent } from '../modals/history-holidays-modal/history-holidays-modal.component';
import { UpcomingAbsencesModalComponent } from '../modals/upcoming-absences-modal/upcoming-absences-modal.component';


const routes: Routes = [
  {
    path: '',
    component: HolidaysPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  declarations: [HolidaysPage, RequestHolidaysModalComponent, HistoryHolidaysModalComponent, UpcomingAbsencesModalComponent],
  entryComponents: [RequestHolidaysModalComponent, HistoryHolidaysModalComponent, UpcomingAbsencesModalComponent]
})
export class HolidaysPageModule {}
