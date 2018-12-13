import { Component, ViewEncapsulation, OnInit, ChangeDetectorRef } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

import { StitchMongoService } from './../services/stitch-mongo.service';
import { AnonymousCredential} from 'mongodb-stitch-browser-sdk';

import { trigger, state, style, animate, transition } from '@angular/animations';

import { Router } from '@angular/router';

import config from '../config/config';

@Component({
  selector: 'app-show-people-popover',
  templateUrl: 'show-people.popover.html',
  styleUrls: ['./show-people.popover.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('scaleAvatar', [
        state('idle', style({
            transform: 'scale(1)'
        })),
        state('clicking', style({
            transform: 'scale(1.5)'
        })),
        transition('idle <=> clicking', animate('100ms linear')),
    ]),
]
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

  constructor(private popoverCtrl: PopoverController, private stitchMongoService: StitchMongoService, private navParams: NavParams,
              private changeDetector: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit() {
    // console.log(this.navParams.data.popoverProps.projectName);
    if (typeof this.navParams.data.popoverProps.projectName !== 'undefined') {
      this.findPeople();
    } else {
      this.people = this.navParams.data.popoverProps.people;
    }
  }

  // {"projects.name" : { $in : ["Project Technical 1"]}}

  findPeople() {
    this.stitchMongoService.client.auth.loginWithCredential(new AnonymousCredential()).then(user =>
      this.stitchMongoService.find(config.COLLECTION_KEY, {'projects.name' : { $in : [this.navParams.data.popoverProps.projectName]}})
    ).then(docs => {
        // Collection is empty.
        if (docs.length === 0) {
          console.log('Collection is empty');
        } else {
          console.log('Found docs', docs);
          this.people = docs;
          this.people.map(people => {
            people.avatarState = 'iddle';
          });
        }
        console.log('[MongoDB Stitch] Connected to Stitch');
    }).catch(err => {
        console.error(err);
    });
  }

  onClickEmployee(person) {
    person.avatarState = 'clicking';
    // this.changeDetector.detectChanges();
    setTimeout(() => {
      this.popoverCtrl.dismiss({data: 'dismissShowPeople'});
      this.router.navigate(['/detail', person.employee_name]);
  }, 300);
  }

}
