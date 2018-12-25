import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

import { StitchMongoService, IziToastService } from './../../services/';
import config from '../../config/config';
import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';

@Component({
  selector: 'app-more-options-popover',
  templateUrl: 'more-options.popover.html',
  styleUrls: ['./more-options.popover.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MoreOptionsPopoverComponent implements OnInit, OnDestroy {

  event: any;

  constructor(private popoverCtrl: PopoverController, private stitchMongoService: StitchMongoService, private storage: Storage,
              private navParams: NavParams, private iziToast: IziToastService) {
  }

  ngOnInit() {
    this.event = this.navParams.data.popoverProps.event;
  }

  ngOnDestroy() {
  }

  updateItem() {
    console.log('MoreOptionsPopoverComponent::updateItem | method called');
  }

  deleteItem() {
    console.log('MoreOptionsPopoverComponent::deleteItem | method called');

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        console.log('objectId', objectId);

        this.stitchMongoService.updateEvents(config.COLLECTION_KEY, objectId, this.event.title)
        .then(docs => {
            console.log(docs);
            this.iziToast.success('Delete event', 'Event deleted successfully.');
            this.popoverCtrl.dismiss(this.event);
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

}
