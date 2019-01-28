import { Component, OnInit } from '@angular/core';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // Add new method to handle event emitted by TodoListHeaderComponent
  onAddTodo(todo: Todo) {
    console.log('TodoPage::onAddTodo() | method called', todo);
  }

  onToggleTodoComplete(todo: Todo) {
    console.log('TodoPage::onToggleTodoComplete() | method called', todo);
  }

  onRemoveTodo(todo: Todo) {
    console.log('TodoPage::onRemoveTodo() | method called', todo);
  }

  get todos() {
    return [];
  }

}
