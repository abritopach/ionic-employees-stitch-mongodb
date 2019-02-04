import { Component, OnInit } from '@angular/core';
import { Todo } from '../models/todo.model';
import { StitchMongoService, IziToastService } from '../services/';

import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';
import config from '../config/config';

import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.page.html',
  styleUrls: ['./todo.page.scss'],
})
export class TodoPage implements OnInit {

  todos: Todo[] = [];
  items = ['Item1', 'Item2', 'Item3'];
  name = '';
  todosCompleted: Todo[] = [];
  showCompletedTodos = false;

  constructor(private stitchMongoService: StitchMongoService, private storage: Storage, private iziToast: IziToastService) { }

  ngOnInit() {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          this.name = result[0]['employee_name'];
          if ((result.length !== 0) && (typeof result[0]['todo'] !== 'undefined')) {
            console.log(result);
            this.todosCompleted = result[0]['todo'].filter(todo => todo.complete === true);
            // this.todos = result[0]['todo'];
            this.todos = result[0]['todo'].filter(todo => todo.complete === false);
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
          if (todo.complete) {
            // Delete task from the pending todo list.
            this.todos = this.todos.filter(t => t.id !== todo.id);
            // Add task to the completed todo list.
            this.todosCompleted.push(todo);
            this.iziToast.success('Update task', 'Task complete.');
          } else {
            // Delete task from the completed todo list.
            this.todosCompleted = this.todosCompleted.filter(t => t.id !== todo.id);
            // Add task to the pending todo list.
            this.todos.push(todo);
            this.iziToast.success('Update task', 'Task incomplete.');
          }
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
            if (!todo.complete) {
              this.todos = this.todos.filter(t => t.id !== todo.id);
            } else {
              this.todosCompleted = this.todosCompleted.filter(t => t.id !== todo.id);
            }
            this.iziToast.success('Delete task', 'Task deleted successfully.');
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

  reorderItems(event) {
    console.log('TodoPage::reorderItems() | method called', event);
    const itemToMove =  this.items.splice(event.detail.from, 1)[0];
    console.log('itemToMove', itemToMove);
    this.items.splice(event.detail.to, 0, itemToMove);
    event.detail.complete();
  }

  onSelectedOption(result) {
    console.log('TodoPage::onSelectedOption() | method called', result);

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);

        if (result.option === 'deselect') {
          const promises = this.todosCompleted.map(todo => {
            todo.complete = !todo.complete;
            return this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'todo.id': todo.id},
            { $set: { 'todo.$' : todo } });
          });
          forkJoin(promises).subscribe(data => {
            console.log(data);
            this.todosCompleted.map(todo => this.todos.push(todo));
            this.todosCompleted = [];
            this.iziToast.success('Deselect tasks', 'Unselect all tasks successfully.');
          });
        }
      }
    });
  }
}
