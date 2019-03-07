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
    NgSelectModule
  ],
  declarations: [NotesListPage, NgSelectModalComponent, ColorPickerComponent, ColorsModalComponent],
  entryComponents: [NgSelectModalComponent, ColorPickerComponent, ColorsModalComponent]
})
export class NotesListPageModule {}
