import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Todo } from '../../../models/todo.model';

import * as moment from 'moment';

import { TodoOptionsPopoverComponent } from '../../../popovers/todo-options/todo-options.popover';

@Component({
  selector: 'app-todo-list-header',
  templateUrl: './todo-list-header.component.html',
  styleUrls: ['./todo-list-header.component.scss']
})
export class TodoListHeaderComponent implements OnInit {

  list = {
    title: 'My list'
  };
  editTitle = false;
  newTodo: Todo = {
    id: 0,
    title: '',
    complete: false,
    dateTime: moment().format('DD-MM-YYYY HH:mm:ss')
  };

  @Output()
  add: EventEmitter<Todo> = new EventEmitter();

  @Output()
  option: EventEmitter<any> = new EventEmitter();

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {
  }

  addTodo() {
    this.add.emit(this.newTodo);
    this.newTodo = {
      id: 0,
      title: '',
      complete: false,
      dateTime: moment().format('DD-MM-YYYY HH:mm:ss')
    };
  }

  async presentPopover() {
    const popover = await this.popoverCtrl.create({
      component: TodoOptionsPopoverComponent,
      // componentProps: componentProps
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
      this.option.emit(data);
    }

  }

}
