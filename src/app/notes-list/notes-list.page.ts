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
import { NgSelectModalComponent } from '../modals/ngselect-modal/ngselect.modal';
import { ColorsModalComponent } from '../modals/colors-modal/colors-modal.component';
import { ReminderModalComponent } from '../modals/reminder-modal/reminder-modal.component';

import {forkJoin} from 'rxjs';

import { Plugins } from '@capacitor/core';
import { Reminder } from '../models/reminder.model';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.page.html',
  styleUrls: ['./notes-list.page.scss'],
})
export class NotesListPage implements OnInit {

  notes: Note[] = [];
  copyNotes: Note[] = [];
  archivedNotes: Note[] = [];
  avatars = null;
  showArchivedNotes = false;

  constructor(private storage: Storage, private stitchMongoService: StitchMongoService, private router: Router,
              private popoverCtrl: PopoverController, private alertCtrl: AlertController,
              private modalCtrl: ModalController) {
      this.getAvatars();
  }

  ionViewWillEnter() {
    console.log('NotesListPage::ionViewWillEnter() | method called');
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          if ((result.length !== 0) && (typeof result[0]['notes'] !== 'undefined')) {
            this.notes = result[0]['notes'];
            console.log('this.notes', this.notes);
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
    const newReminder: Reminder = {
      type: ''
    };
    const newNote: Note = {
      id: new ObjectId(),
      title: 'My new note',
      todos: [],
      archived: false,
      tags: [],
      pinned: false,
      updated_at: new Date(),
      collaborators: [],
      color: '#fff',
      reminder: newReminder
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
            this.checkCollaborators('deleteNote', note);
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
        note.updated_at = new Date();
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
        { $set: { 'notes.$.archived' : note.archived, 'notes.$.updated_at': note.updated_at} })
        .then(result => {
            console.log(result);
            if (note.archived) {
              this.notes = this.notes.filter(n => n.id !== note.id);
              this.archivedNotes.push(note);
            } else {
              this.notes.push(note);
              this.archivedNotes = this.archivedNotes.filter(n => n.id !== note.id);
            }
            this.checkCollaborators('archiveNote', note);
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
          note.updated_at = new Date();
          this.checkCollaborators('archiveAllNotes', note);
          return  this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
          { $set: { 'notes.$.archived' : note.archived, 'notes.$.updated_at': note.updated_at} });
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
            if (option === 'deleteReminder') {
              this.deleteReminder(note);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentModal(options: {title: string, note?: Note, action?: string}, component) {
    const componentProps = { modalProps: { title: options.title, note: options.note, action: options.action}};
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
      if (data.option === 'tag') {
        this.addNewTags(options.note, data.newData);
      }
      if (data.option === 'collaborator') {
        this.addNewCollaborators(options.note, data.newData);
      }
      if (data.option === 'colour') {
        console.log(data);
        console.log(options.note);
        this.setColorNote(options.note, data.color);
      }
      if (data.option === 'reminder') {
        this.reminderNote(options.note, data.reminder);
      }
    }
  }

  addNewTags(note, newTags) {
    // const tags = [...note.tags, ...newTags];
    // console.log('tags', tags);
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        note.updated_at = new Date();
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
        {$set: { 'notes.$.tags': newTags, 'notes.$.updated_at': note.updated_at }})
        .then(result => {
          console.log('result', result);
          note.tags = newTags;
          this.checkCollaborators('tagNote', note, newTags);
        });
      }
    });
  }

  addNewCollaborators(note, newCollaborators) {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        const collaborators = newCollaborators.map(c => new ObjectId(c));
        note.updated_at = new Date();
        // Added collaborators to user's note.
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
        {$set: { 'notes.$.collaborators': collaborators, 'notes.$.updated_at': note.updated_at }})
        .then(result => {
          console.log('result', result);
          note.collaborators = newCollaborators;
          console.log('note', note);
        });

        const promises = collaborators.map(collaborator => {
          const copyNote = {...note};
          const c = [];
          c.push(objectId);
          copyNote.collaborators = c;
          console.log('copyNote', copyNote);
          return  this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: collaborator},
          { $push: { 'notes': copyNote } });
        });
        forkJoin(promises).subscribe(data => {
          console.log(data);
        });
      }
    });
  }

  setColorNote(note, color) {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        note.updated_at = new Date();
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
        {$set: { 'notes.$.color': color, 'notes.$.updated_at': note.updated_at }})
        .then(result => {
          console.log('result', result);
          note.color = color;
          this.checkCollaborators('colourNote', note);
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
            this.checkCollaborators('createCopyNote', copyNote);
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
        note.updated_at = new Date();
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
        { $set: { 'notes.$.pinned' : note.pinned, 'notes.$.updated_at': note.updated_at} })
        .then(result => {
            console.log(result);
            this.notes.sort((n1, n2) => Number(n2.pinned) - Number(n1.pinned));
            this.checkCollaborators('pinnedNote', note);
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

  reminderNote(note, reminder) {

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        note.updated_at = new Date();
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
        {$set: { 'notes.$.reminder': reminder, 'notes.$.updated_at': note.updated_at }})
        .then(result => {
          console.log('result', result);
          note.reminder = reminder;

          // TODO: Local Notifications code.
        });
      }
    });

    /*
    const { LocalNotifications } = Plugins;

    LocalNotifications.schedule({
      notifications: [
        {
          title: 'Title',
          body: 'Body',
          id: 1,
          schedule: { at: new Date(Date.now() + 1000 * 5) },
          sound: null,
          attachments: null,
          actionTypeId: '',
          extra: null
        }
      ]
    });
    */
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
            {name: 'Pinned', icon: 'pin', function: 'pinnedNote'},
            {name: 'Collaborator', icon: 'person-add', function: 'collaboratorNote'},
            {name: 'Color', icon: 'color-palette', function: 'colourNote'},
            {name: 'Reminder', icon: 'notifications', function: 'reminderNote'}
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
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const userId = new ObjectId(res);
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
            this.presentModal({title: 'Add new tags', note: note, action: 'tag'}, NgSelectModalComponent);
            break;
          case 'createCopyNote':
            this.createNoteCopy(note);
            break;
          case 'pinnedNote':
            this.pinnedNote(note);
            break;
          case 'collaboratorNote':
            this.presentModal({title: 'Add new collaborators', note: note, action: 'collaborator'}, NgSelectModalComponent);
            break;
          case 'colourNote':
            this.presentModal({title: 'Select color', note: note}, ColorsModalComponent);
            break;
          case 'reminderNote':
            this.presentModal({title: 'Add reminder', note: note}, ReminderModalComponent);
            break;
        }
      }
    });
  }

  getAvatars() {
    this.stitchMongoService.find(config.COLLECTION_KEY, {}).then(docs => {
      this.avatars = docs.map(doc => {
        const item = {user_id: doc['user_id'].toString(), avatar: doc['avatar']};
        return item;
      });
    }).catch(err => {
        console.error(err);
    });
  }

  getAvatarById(id) {
    if (this.avatars !== null) {
      return this.avatars
      .filter(avatar => avatar.user_id === id)
      .pop();
    }
  }

  updateCollaboratorNote(note, filter, action) {
    console.log('NotesListPage::updateCollaboratorNote() | method called');
    return this.stitchMongoService.update(config.COLLECTION_KEY, filter, action);
  }

  checkCollaborators(option, note, newTags?) {
    if ((typeof note.collaborators !== 'undefined') && (note.collaborators.length !== 0)) {
      console.log(note.collaborators);
      const promises = note.collaborators.map(collaborator => {
        console.log(collaborator);

        switch (option) {
          case 'deleteNote':
            // return this.deleteNote(note, new ObjectId(collaborator));
            return this.updateCollaboratorNote(note, {user_id: new ObjectId(collaborator)}, { $pull: { 'notes': { id: note.id } } });
          case 'archiveNote':
            return this.updateCollaboratorNote(note, {user_id: new ObjectId(collaborator), 'notes.id': note.id},
            { $set: { 'notes.$.archived' : note.archived, 'notes.$.updated_at': note.updated_at} });
          case 'tagNote':
            return this.updateCollaboratorNote(note, {user_id: new ObjectId(collaborator), 'notes.id': note.id},
            {$set: { 'notes.$.tags': newTags, 'notes.$.updated_at': note.updated_at }});
          case 'createCopyNote':
            return this.updateCollaboratorNote(note, {user_id: new ObjectId(collaborator)},
            {$push: { 'notes': note }});
          case 'pinnedNote':
            return this.updateCollaboratorNote(note, {user_id: new ObjectId(collaborator), 'notes.id': note.id},
            { $set: { 'notes.$.pinned' : note.pinned, 'notes.$.updated_at': note.updated_at} });
          case 'archiveAllNotes':
            return this.updateCollaboratorNote(note, {user_id: new ObjectId(collaborator), 'notes.id': note.id},
            { $set: { 'notes.$.archived' : note.archived, 'notes.$.updated_at': note.updated_at} });
          case 'colourNote':
            return this.updateCollaboratorNote(note, {user_id: new ObjectId(collaborator), 'notes.id': note.id},
            {$set: { 'notes.$.color': note.color, 'notes.$.updated_at': note.updated_at }});
        }

      });
      forkJoin(promises).subscribe(d => {
        console.log(d);
      });
    } else {
      console.log('checkCollaborators: empty collaborators');
    }
  }

  deleteReminder(note) {
    console.log('NotesListPage::deleteReminder(note) | method called');
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        delete note.reminder;
        note.updated_at = new Date();
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'notes.id': note.id},
        { $unset: { 'notes.$.reminder' : '' }, $set: { 'notes.$.updated_at': note.updated_at} })
        .then(result => {
            console.log(result);
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

}
