import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TodoPage } from './todo.page';

// import { TodoListHeaderComponent, TodoListComponent, TodoListItemComponent, TodoListFooterComponent } from '../components/todo/';

import { TodoOptionsPopoverComponent } from '../popovers/todo-options/todo-options.popover';

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
  declarations: [TodoPage, TodoOptionsPopoverComponent],
  entryComponents: [TodoOptionsPopoverComponent]
})
export class TodoPageModule {}
