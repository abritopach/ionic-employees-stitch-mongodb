import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

import { StitchMongoService } from './../services/stitch-mongo.service';
import { AnonymousCredential} from 'mongodb-stitch-browser-sdk';

@Component({
  selector: 'app-show-people-popover',
  templateUrl: 'show-people.popover.html',
  styleUrls: ['./show-people.popover.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShowPeoplePopoverComponent implements OnInit {

  /*
  people: any = [
    {avatar: 'http://i.pravatar.cc/150?img=7'},
    {avatar: 'http://i.pravatar.cc/150?img=8'},
    {avatar: 'http://i.pravatar.cc/150?img=9'},
    {avatar: 'http://i.pravatar.cc/150?img=10'},
    {avatar: 'http://i.pravatar.cc/150?img=11'},
    {avatar: 'http://i.pravatar.cc/150?img=12'}
  ];
  */
  people: any;

  constructor(private popoverCtrl: PopoverController, private stitchMongoService: StitchMongoService, private navParams: NavParams) {
  }

  ngOnInit() {
    console.log(this.navParams.data.popoverProps.projectName);
    this.findPeople();
  }

  // {"projects.name" : { $in : ["Project Technical 1"]}}

  findPeople() {
    this.stitchMongoService.client.auth.loginWithCredential(new AnonymousCredential()).then(user =>
      this.stitchMongoService.find('employees', {'projects.name' : { $in : [this.navParams.data.popoverProps.projectName]}})
    ).then(docs => {
        // Collection is empty.
        if (docs.length === 0) {
          console.log('Collection is empty');
        } else {
          console.log('Found docs', docs);
          this.people = docs;
        }
        console.log('[MongoDB Stitch] Connected to Stitch');
    }).catch(err => {
        console.error(err);
    });
  }

}
