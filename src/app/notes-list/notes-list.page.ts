import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';
import config from '../config/config';

import { Note } from '../models/note.model';

import { StitchMongoService } from '../services';

import { Router } from '@angular/router';
import { Todo } from '../models/todo.model';

import { PopoverController } from '@ionic/angular';

import { MoreOptionsPopoverComponent } from '../popovers/more-options/more-options.popover';


@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.page.html',
  styleUrls: ['./notes-list.page.scss'],
})
export class NotesListPage implements OnInit {

  notes: Note[] = [];
  archivedNotes: Note[] = [];

  constructor(private storage: Storage, private stitchMongoService: StitchMongoService, private router: Router,
              private popoverCtrl: PopoverController) { }

  ionViewWillEnter() {
    console.log('NotesListPage::ionViewWillEnter() | method called');
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          if ((result.length !== 0) && (typeof result[0]['notes'] !== 'undefined')) {
            this.notes = result[0]['notes'];
            this.notes = this.notes.map(note => {
              return { ...note, todos: note.todos.filter(todo => !todo.complete) };
            });
            this.notes = this.notes.filter(note => !note.archived);
            this.archivedNotes = result[0]['notes'].filter(note => note.archived);
          }
        });
      }
    });
  }

  ngOnInit() {
    console.log('NotesListPage::ngOnInit() | method called');
  }

  addNewNote() {
    console.log('NotesListPage::addNewNote() | method called');
    const newNote: Note = {
      id: new ObjectId(),
      title: 'My new note',
      todos: [],
      archived: false
    };
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        // TODO: Add new note.
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId},
          {$push: { 'notes': newNote }})
          .then(result => {
            console.log('result', result);
            this.notes.push(newNote);
          });
        }
    });
  }

  async presentPopover(options, note?) {
    console.log('NotesListPage::presentPopover() | method called', options);
    let componentProps;
    if (options === 'optionsAllNotes') {
      componentProps = { popoverProps: { title: 'Options',
        options: [
          {name: 'Delete all notes', icon: 'close-circle-outline', function: 'deleteAllNotes'},
          {name: 'Archive all notes', icon: 'archive', function: 'archiveAllNotes'}
        ]
      }};
    } else if (options === 'optionsNote') {
      componentProps = { popoverProps: { title: 'Options',
      options: [
        {name: 'Delete', icon: 'close-circle-outline', function: 'deleteNote'},
        {name: 'Archive', icon: 'archive', function: 'archiveNote'}
      ]
    }};
    } else if (options === 'optionsArchivedNote') {
      componentProps = { popoverProps: { title: 'Options',
      options: [
        {name: 'Delete', icon: 'close-circle-outline', function: 'deleteNote'},
        {name: 'Unarchive', icon: 'clipboard', function: 'unarchiveNote'}
      ]
    }};
    }

    const popover = await this.popoverCtrl.create({
      component: MoreOptionsPopoverComponent,
      componentProps: componentProps
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
      if (data.option === 'deleteNote') {
        this.deleteNote(note);
      }
    }

  }

  deleteNote(note) {
    console.log('NotesListPage::deleteNote() | method called');
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId},
        { $pull: { 'notes': { id: note.id } } })
        .then(result => {
            console.log(result);
            this.notes = this.notes.filter(n => n.id !== note.id);
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

}
