import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TodoPage } from './todo.page';

import { TodoListHeaderComponent } from '../components/todo/todo-list-header/todo-list-header.component';
import { TodoListComponent } from '../components/todo/todo-list/todo-list.component';
import { TodoListItemComponent } from '../components/todo/todo-list-item/todo-list-item.component';
import { TodoListFooterComponent } from '../components/todo/todo-list-footer/todo-list-footer.component';

import { SharedComponentsModule } from '../components/shared-components.module';

const routes: Routes = [
  {
    path: '',
    component: TodoPage
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
  declarations: [TodoPage, TodoListHeaderComponent, TodoListComponent, TodoListItemComponent, TodoListFooterComponent]
})
export class TodoPageModule {}
