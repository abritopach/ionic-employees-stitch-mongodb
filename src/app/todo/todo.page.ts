import { Component, OnInit } from '@angular/core';
import { Todo } from '../models/todo.model';
import { StitchMongoService, IziToastService } from '../services/';

import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';
import config from '../config/config';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  todos: Todo[] = [];

  constructor(private stitchMongoService: StitchMongoService, private storage: Storage, private iziToast: IziToastService) { }

  ngOnInit() {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          if ((result.length !== 0) && (typeof result[0]['todo'] !== 'undefined')) {
            console.log(result);
            this.todos = result[0]['todo'];
          }
        });
      }
    });
  }

  // Add new method to handle event emitted by TodoListHeaderComponent
  onAddTodo(todo: Todo) {
    console.log('TodoPage::onAddTodo() | method called', todo);
    // this.stitchMongoService.addTodo(todo);
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        todo.id = new ObjectId();
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId}, {$push: { todo: todo }})
        .then(result => {
          console.log('result', result);
          this.todos.push(todo);
          this.iziToast.success('Add task', 'Task added successfully.');
        });
      }
    });
  }

  onToggleTodoComplete(todo: Todo) {
    console.log('TodoPage::onToggleTodoComplete() | method called', todo);
    // this.stitchMongoService.toggleTodoComplete(todo);
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        todo.complete = !todo.complete;
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'todo.id': todo.id},
        { $set: { 'todo.$' : todo } }).then(result => {
          console.log('result', result);
          this.iziToast.success('Update task', 'Task complete.');
        });
      }
    });
  }

  onRemoveTodo(todo: Todo) {
    console.log('TodoPage::onRemoveTodo() | method called', todo);
    // this.stitchMongoService.deleteTodoById(todo.id);
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId}, {$pull: { todo: { title: todo.title } }})
        .then(result => {
            console.log(result);
            this.todos = this.todos.filter(t => t.id !== todo.id);
            this.iziToast.success('Delete task', 'Task deleted successfully.');
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

  /*
  get todos() {
    return this.stitchMongoService.getAllTodos();
  }
  */

}
