import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.scss']
})
export class TodoListItemComponent implements OnInit {

  @Input() todo: Todo;

  @Output()
  remove: EventEmitter<Todo> = new EventEmitter();

  @Output()
  toggleComplete: EventEmitter<Todo> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggleTodoComplete(todo: Todo) {
    console.log('TodoListItemComponent::toggleTodoComplete() | method called', todo);
    this.toggleComplete.emit(todo);
  }

  removeTodo(todo: Todo) {
    console.log('TodoListItemComponent::removeTodo() | method called', todo);
    this.remove.emit(todo);
  }

}
