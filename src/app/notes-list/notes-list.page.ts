import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';
import config from '../config/config';

import { Note } from '../models/note.model';

import { StitchMongoService } from '../services';

import { Router } from '@angular/router';
import { Todo } from '../models/todo.model';

import { PopoverController, AlertController, ModalController } from '@ionic/angular';

import { MoreOptionsPopoverComponent } from '../popovers/more-options/more-options.popover';
import { TagsModalComponent } from '../modals/tags-modal/tags.modal';

import {forkJoin} from 'rxjs';
import { not } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.page.html',
  styleUrls: ['./notes-list.page.scss'],
})
export class NotesListPage implements OnInit {

  notes: Note[] = [];
  copyNotes: Note[] = [];
  archivedNotes: Note[] = [];

  constructor(private storage: Storage, private stitchMongoService: StitchMongoService, private router: Router,
              private popoverCtrl: PopoverController, private alertCtrl: AlertController,
              private modalCtrl: ModalController) { }

  ionViewWillEnter() {
    console.log('NotesListPage::ionViewWillEnter() | method called');
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          if ((result.length !== 0) && (typeof result[0]['notes'] !== 'undefined')) {
            this.notes = result[0]['notes'];
            this.notes = this.copyNotes = this.notes.map(note => {
              return { ...note, todos: note.todos.filter(todo => !todo.complete) };
            });
            this.notes = this.copyNotes.filter(note => !note.archived);
            // Sort notes to show first the pinned ones.
            this.notes.sort((n1, n2) => Number(n2.pinned) - Number(n1.pinned));
            this.archivedNotes = this.copyNotes.filter(note => note.archived);
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
      archived: false,
      tags: [],
      pinned: false,
      updated_at: new Date()
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
    const componentProps = this.builtComponentProps(options);

    const popover = await this.popoverCtrl.create({
      component: MoreOptionsPopoverComponent,
      componentProps: componentProps
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      this.processData(data, note);
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
            if (note.archived) {
              this.archivedNotes = this.archivedNotes.filter(n => n.id !== note.id);
            } else {
              this.notes = this.notes.filter(n => n.id !== note.id);
            }
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

  archiveNote(note) {
    console.log('NotesListPage::archiveNote() | method called', note);
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        note.archived = !note.archived;
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
        { $set: { 'notes.$.archived' : note.archived, } })
        .then(result => {
            console.log(result);
            if (note.archived) {
              this.notes = this.notes.filter(n => n.id !== note.id);
              this.archivedNotes.push(note);
            } else {
              this.notes.push(note);
              this.archivedNotes = this.archivedNotes.filter(n => n.id !== note.id);
            }
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

  archiveAllNotes() {
    console.log('NotesListPage::archiveAllNotes() | method called');

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        const promises = this.notes.map(note => {
          note.archived = !note.archived;
          return  this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
          { $set: { 'notes.$.archived' : note.archived, } });
        });
        console.log(promises);
        forkJoin(promises).subscribe(data => {
          console.log(data);
          this.copyNotes.map(note => this.archivedNotes.push(note));
          this.notes = [];
        });
      }
    });
  }

  deleteAllNotes() {
    console.log('NotesListPage::deleteAllNotes() | method called');

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        const promises = this.copyNotes.map(note => {
          return this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId},
            {$pull: { 'notes': { id: note.id } }});
        });
        forkJoin(promises).subscribe(data => {
          console.log(data);
          this.notes = this.archivedNotes = [];
        });
      }
    });
  }

  async presentAlertConfirm(options = {header: 'Header', message: 'message', option: 'option', note: null}) {
    const {header, message, option, note} = options;
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: () => {
            if (option === 'deleteAllNotes') {
              this.deleteAllNotes();
            }
            if (option === 'deleteNote') {
              this.deleteNote(note);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentModal(note) {
    const componentProps = { modalProps: { title: 'New tags', note: note}};
    const modal = await this.modalCtrl.create({
      component: TagsModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
      this.addNewTags(note, data.newTags);
    }
  }

  addNewTags(note, newTags) {
    // const tags = [...note.tags, ...newTags];
    // console.log('tags', tags);
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
        {$set: { 'notes.$.tags': newTags }})
        .then(result => {
          console.log('result', result);
          note.tags = newTags;
        });
      }
    });
  }

  createNoteCopy(note) {
    console.log('NotesListPage::createNoteCopy() | method called');
    const copyNote = {...note, ...{id: new ObjectId(), title: 'Copy ' + note.title}};
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId},
          {$push: { 'notes': copyNote }})
          .then(result => {
            console.log('result', result);
            this.notes.push(copyNote);
          });
        }
    });
  }

  pinnedNote(note) {
    console.log('NotesListPage::pinnedNote() | method called', note);
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        note.pinned = !note.pinned;
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
        { $set: { 'notes.$.pinned' : note.pinned, } })
        .then(result => {
            console.log(result);
            this.notes.sort((n1, n2) => Number(n2.pinned) - Number(n1.pinned));
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

  builtComponentProps(options) {
    let componentProps;
    switch (options) {
      case 'optionsAllNotes':
        componentProps = { popoverProps: { title: 'Options',
          options: [
            {name: 'Delete all notes', icon: 'close-circle-outline', function: 'deleteAllNotes'},
            {name: 'Archive all notes', icon: 'archive', function: 'archiveAllNotes'}
          ]
        }};
        break;
      case 'optionsNote':
        componentProps = { popoverProps: { title: 'Options',
          options: [
            {name: 'Delete', icon: 'close-circle-outline', function: 'deleteNote'},
            {name: 'Archive', icon: 'archive', function: 'archiveNote'},
            {name: 'Create copy', icon: 'copy', function: 'createCopyNote'},
            {name: 'Tags', icon: 'pricetags', function: 'tagNote'},
            {name: 'Pinned', icon: 'pin', function: 'pinnedNote'}
          ]
        }};
        break;
      case 'optionsArchivedNote':
        componentProps = { popoverProps: { title: 'Options',
          options: [
            {name: 'Delete', icon: 'close-circle-outline', function: 'deleteNote'},
            {name: 'Unarchive', icon: 'clipboard', function: 'unarchiveNote'}
          ]
        }};
        break;
    }
    return componentProps;
  }

  processData(data, note) {
    switch (data.option) {
      case 'deleteNote':
        this.presentAlertConfirm({header: 'Delete note', message: 'Are you sure that you want to delete the note?',
        option: 'deleteNote', note: note});
        break;
      case 'archiveNote':
        this.archiveNote(note);
        break;
      case 'unarchiveNote':
        this.archiveNote(note);
        break;
      case 'archiveAllNotes':
        this.archiveAllNotes();
        break;
      case 'deleteAllNotes':
        this.presentAlertConfirm({header: 'Delete all notes', message: 'Are you sure that you want to delete all the notes?',
        option: 'deleteAllNotes', note: null});
        break;
      case 'tagNote':
        this.presentModal(note);
        break;
      case 'createCopyNote':
        this.createNoteCopy(note);
        break;
      case 'pinnedNote':
        this.pinnedNote(note);
        break;
    }
  }

}
