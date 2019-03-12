import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotesListPage } from './notes-list.page';

import { SharedComponentsModule } from '../components/shared-components.module';
import { NgSelectModalComponent } from '../modals/ngselect-modal/ngselect.modal';

import { NgSelectModule } from '@ng-select/ng-select';

import { ColorPickerComponent } from '../components/color-picker/color-picker.component';
import { ColorsModalComponent } from '../modals/colors-modal/colors-modal.component';
import { ReminderModalComponent } from '../modals/reminder-modal/reminder-modal.component';
import { FrequencyComponent } from '../popovers/frequency/frequency.component';

import { DragulaModule } from 'ng2-dragula';

const routes: Routes = [
  {
    path: '',
    component: NotesListPage
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
    DragulaModule.forRoot()
  ],
  declarations: [NotesListPage, NgSelectModalComponent, ColorPickerComponent, ColorsModalComponent, ReminderModalComponent,
                FrequencyComponent],
  entryComponents: [NgSelectModalComponent, ColorPickerComponent, ColorsModalComponent, ReminderModalComponent, FrequencyComponent]
})
export class NotesListPageModule {}
