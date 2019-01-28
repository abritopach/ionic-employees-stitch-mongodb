import { Component, OnInit } from '@angular/core';
import { Todo } from '../models/todo.model';
import { StitchMongoService } from '../services/stitch-mongo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  constructor(private stitchMongoService: StitchMongoService) { }

  ngOnInit() {
  }

  // Add new method to handle event emitted by TodoListHeaderComponent
  onAddTodo(todo: Todo) {
    console.log('TodoPage::onAddTodo() | method called', todo);
      this.stitchMongoService.addTodo(todo);
  }

  onToggleTodoComplete(todo: Todo) {
    console.log('TodoPage::onToggleTodoComplete() | method called', todo);
    this.stitchMongoService.toggleTodoComplete(todo);
  }

  onRemoveTodo(todo: Todo) {
    console.log('TodoPage::onRemoveTodo() | method called', todo);
    this.stitchMongoService.deleteTodoById(todo.id);
  }

  get todos() {
    return this.stitchMongoService.getAllTodos();
  }

}
