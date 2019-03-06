import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Todo } from '../models/todo.model';
import { Note } from '../models/note.model';
import { StitchMongoService, IziToastService } from '../services/';

import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';
import config from '../config/config';

import {forkJoin} from 'rxjs';

import { ActivatedRoute } from '@angular/router';


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
  noteTitle = '';
  note: Note;

  constructor(private stitchMongoService: StitchMongoService, private storage: Storage, private iziToast: IziToastService,
              private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    console.log('TodoPage::ngOnInit() | method called');
    const noteId = this.route.snapshot.paramMap.get('id');
    this.getNote(noteId);

    /*
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
    */
  }

  getNote(noteId) {

    const noteObjectId = new ObjectId(noteId);

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          this.name = result[0]['employee_name'];
          if ((result.length !== 0) && (typeof result[0]['notes'] !== 'undefined')) {
            const note = result[0]['notes'].filter((n: Note) => n.id.toString() === noteObjectId.toString() );
            console.log(note[0]);
            this.note = note[0];
            // TODO: FIX problem updating nested array.
            note[0].todos = note[0].todos.map((todo, index) => {
              todo.index = index;
              return todo;
            });
            this.todosCompleted = note[0].todos.filter(todo => todo.complete === true);
            this.todos = note[0].todos.filter(todo => todo.complete === false);
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
        const noteObjectId = new ObjectId(this.route.snapshot.paramMap.get('id'));
        todo.id = new ObjectId();
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': noteObjectId},
        {$set: {'notes.$.updated_at': new Date()}, $push: { 'notes.$.todos': todo }})
        .then(result => {
          console.log('result', result);
          // TODO: FIX problem updating nested array.
          todo['index'] = this.todos.length;
          this.todos.push(todo);
          this.iziToast.success('Add task', 'Task added successfully.');
          this.checkCollaborators('addTodo', this.note, todo);
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
        const obj = {};
        obj['notes.$.todos.' + todo['index']] = todo;
        obj['notes.$.updated_at'] = new Date();
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.todos.id': todo.id},
        { $set: obj }
        // TODO: Refactor code to use arrayFilters.
        // { $set: { 'notes.$.todos.$[t]' : todo } }).then(result => {
        /*
        { $set: { 'notes.$.todos.$[todo]' : todo } },
        {
          arrayFilters: [ { 'todo.id': todo.id } ]
        }*/).then(result => {
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
          this.checkCollaborators('toggleTodo', this.note, todo);
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
        const noteObjectId = new ObjectId(this.route.snapshot.paramMap.get('id'));
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': noteObjectId},
        {$set: {'notes.$.updated_at': new Date()}, $pull: { 'notes.$.todos': { title: todo.title } }})
        .then(result => {
            console.log(result);
            if (!todo.complete) {
              this.todos = this.todos.filter(t => t.id !== todo.id);
            } else {
              this.todosCompleted = this.todosCompleted.filter(t => t.id !== todo.id);
            }
            this.iziToast.success('Delete task', 'Task deleted successfully.');
            this.checkCollaborators('removeTodo', this.note, todo);
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
        const noteObjectId = new ObjectId(this.route.snapshot.paramMap.get('id'));
        if (result.option === 'deselect') {
          const promises = this.todosCompleted.map(todo => {
            todo.complete = !todo.complete;
            const obj = {};
            obj['notes.$.todos.' + todo['index']] = todo;
            obj['notes.$.updated_at'] = new Date();
            this.checkCollaborators('deselectTasks', this.note, todo);
            return this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.todos.id': todo.id},
            { $set: obj });
          });
          forkJoin(promises).subscribe(data => {
            console.log(data);
            this.todosCompleted.map(todo => this.todos.push(todo));
            this.todosCompleted = [];
            this.iziToast.success('Deselect all tasks', 'Unselect all tasks successfully.');
          });
        } else if (result.option === 'delete') {
          const promises = this.todosCompleted.map(todo => {
            this.checkCollaborators('deleteSelected', this.note, todo);
            return this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': noteObjectId},
             {$set: {'notes.$.updated_at': new Date()}, $pull: { 'notes.$.todos': { title: todo.title } }});
          });
          forkJoin(promises).subscribe(data => {
            console.log(data);
            this.todosCompleted = [];
            this.iziToast.success('Delete selected items', 'Deleted all selected tasks successfully.');
          });
        }
      }
    });
  }

  deleteNote() {
    console.log('TodoPage::deleteNote() | method called');
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId},
        { $pull: { 'notes': { id: this.note.id } } })
        .then(result => {
            console.log(result);
            this.iziToast.success('Delete note', 'Note deleted successfully.');
            this.checkCollaborators('deleteNote', this.note);
            this.location.back();
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

  createNoteCopy() {
    console.log('TodoPage::createNoteCopy() | method called', this.note);
    const copyNote = {...this.note, ...{id: new ObjectId(), title: 'Copy ' + this.note.title}};
    console.log('copyNote', copyNote);
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId},
          {$push: { 'notes': copyNote }})
          .then(result => {
            console.log('result', result);
            this.checkCollaborators('copyNote', copyNote);
            this.iziToast.success('Copy note', 'Created copy note successfully.');
          });
        }
    });
  }

  onTitleChanged(newNoteTitle) {
    console.log('TodoPage::onTitleChanged() | method called', newNoteTitle);
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        const noteObjectId = new ObjectId(this.route.snapshot.paramMap.get('id'));
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': noteObjectId},
        {$set: { 'notes.$.title': newNoteTitle , 'notes.$.updated_at': new Date()}})
        .then(result => {
          console.log('result', result);
        });
      }
    });
  }

  updateCollaboratorNote(filter, action) {
    console.log('TodoPage::updateCollaboratorNote() | method called');
    return this.stitchMongoService.update(config.COLLECTION_KEY, filter, action);
  }

  checkCollaborators(option, note, todo?) {
    if ((typeof note.collaborators !== 'undefined') && (note.collaborators.length !== 0)) {
      console.log(note.collaborators);
      const promises = note.collaborators.map(collaborator => {
        console.log(collaborator);

        switch (option) {
          case 'addTodo':
            return this.updateCollaboratorNote({user_id: new ObjectId(collaborator), 'notes.id': note.id},
            {$set: {'notes.$.updated_at': new Date()}, $push: { 'notes.$.todos': todo }});
          case 'removeTodo':
            return this.updateCollaboratorNote({user_id: new ObjectId(collaborator), 'notes.id': note.id},
            {$set: {'notes.$.updated_at': new Date()}, $pull: { 'notes.$.todos': { title: todo.title } }});
          case 'toggleTodo':
            const obj = {};
            obj['notes.$.todos.' + todo['index']] = todo;
            obj['notes.$.updated_at'] = new Date();
            return this.updateCollaboratorNote({user_id: new ObjectId(collaborator), 'notes.todos.id': todo.id},
            { $set: obj });
          case 'copyNote':
            return this.updateCollaboratorNote({user_id: new ObjectId(collaborator)}, {$push: { 'notes': note }});
          case 'deleteNote':
            return this.updateCollaboratorNote({user_id: new ObjectId(collaborator)}, { $pull: { 'notes': { id: note.id } } });
          case 'deselectTasks':
            const obj1 = {};
            obj1['notes.$.todos.' + todo['index']] = todo;
            obj1['notes.$.updated_at'] = new Date();
            return this.updateCollaboratorNote({user_id: new ObjectId(collaborator), 'notes.todos.id': todo.id},
            { $set: obj1 });
          case 'deleteSelected':
            return this.updateCollaboratorNote({user_id: new ObjectId(collaborator), 'notes.id': note.id},
            {$set: {'notes.$.updated_at': new Date()}, $pull: { 'notes.$.todos': { title: todo.title } }});
        }
      });
      forkJoin(promises).subscribe(d => {
        console.log(d);
      });
    } else {
      console.log('checkCollaborators: empty collaborators');
    }
  }

}
