import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Todo } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  @Input()
  todos: Todo[];

  @Output()
  remove: EventEmitter<Todo> = new EventEmitter();

  @Output()
  toggleComplete: EventEmitter<Todo> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onToggleTodoComplete(todo: Todo) {
    console.log('TodoListComponent::onToggleTodoComplete() | method called', todo);
    this.toggleComplete.emit(todo);
  }

  onRemoveTodo(todo: Todo) {
    console.log('TodoListComponent::onRemoveTodo() | method called', todo);
    this.remove.emit(todo);
  }

}
