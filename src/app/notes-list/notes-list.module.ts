import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotesListPage } from './notes-list.page';

import { SharedComponentsModule } from '../components/shared-components.module';
import { NgSelectModalComponent } from '../modals/ngselect-modal/ngselect.modal';

import { NgSelectModule } from '@ng-select/ng-select';

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
  declarations: [NotesListPage, NgSelectModalComponent],
  entryComponents: [NgSelectModalComponent]
})
export class NotesListPageModule {}
