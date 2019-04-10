import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HolidaysPage } from './holidays.page';

import { SharedComponentsModule } from '../components/shared-components.module';
import { RequestHolidaysModalComponent } from '../modals/request-holidays-modal/request-holidays-modal.component';
import { HistoryHolidaysModalComponent } from '../modals/history-holidays-modal/history-holidays-modal.component';

import { NgSelectModule } from '@ng-select/ng-select';

// Angular Calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

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
    SharedComponentsModule,
    NgSelectModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  declarations: [HolidaysPage, RequestHolidaysModalComponent, HistoryHolidaysModalComponent],
  entryComponents: [RequestHolidaysModalComponent, HistoryHolidaysModalComponent]
})
export class HolidaysPageModule {}
