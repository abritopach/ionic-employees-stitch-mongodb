import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../../models/todo.model';

import * as moment from 'moment';

@Component({
  selector: 'app-todo-list-header',
  templateUrl: './todo-list-header.component.html',
  styleUrls: ['./todo-list-header.component.scss']
})
export class TodoListHeaderComponent implements OnInit {

  newTodo: Todo = {
    id: 0,
    title: '',
    complete: false,
    dateTime: moment().format('DD-MM-YYYY HH:mm:ss')
  };

  @Output()
  add: EventEmitter<Todo> = new EventEmitter();

  constructor() { }

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

}
