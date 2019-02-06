import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';
import config from '../config/config';

import { Note } from '../models/note.model';

import { StitchMongoService } from '../services';


@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.page.html',
  styleUrls: ['./notes-list.page.scss'],
})
export class NotesListPage implements OnInit {

  notes: Note[] = [];

  constructor(private storage: Storage, private stitchMongoService: StitchMongoService) { }

  ngOnInit() {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          if ((result.length !== 0) && (typeof result[0]['notes'] !== 'undefined')) {
            console.log(result);
            this.notes = result[0]['notes'];
          }
        });
      }
    });
  }

  viewNoteDetails(note) {
    console.log('NotesListPage::viewNoteDetails() | method called', note);
    // this.router.navigateByUrl('/detail');
  }

}
