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

  @Input()
  readOnly: boolean;

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

  reorderItems(event) {
    console.log('TodoListComponent::reorderItems() | method called', event);
    // const itemToMove =  this.todos.splice(event.detail.from, 1)[0];
    // consol e.log('itemToMove', itemToMove);
    // this.todos.splice(event.detail.to, 0, itemToMove);
    // event.detail.complete();
    this.todos = event.detail.complete(this.todos);
  }

}
