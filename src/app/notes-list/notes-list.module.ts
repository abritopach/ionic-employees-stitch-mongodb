import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NotesListPage } from './notes-list.page';

import { SharedComponentsModule } from '../components/shared-components.module';

import { TodoListComponent, TodoListItemComponent } from '../components/todo/';

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
    IonicModule,
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  declarations: [NotesListPage, TodoListComponent, TodoListItemComponent]
})
export class NotesListPageModule {}
