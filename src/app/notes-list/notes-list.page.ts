import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';
import config from '../config/config';

import { StitchMongoService } from '../services';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.page.html',
  styleUrls: ['./notes-list.page.scss'],
})
export class NotesListPage implements OnInit {

  /*
  notes = [
    {title: 'List1', description: 'Description 1'},
    {title: 'List2', description: 'Description 2'},
    {title: 'List3', description: 'Description 3'},
    {title: 'List4', description: 'Description 4'},
    {title: 'List5', description: 'Description 5'}
  ];
  */

  notes: any = [];

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

}
