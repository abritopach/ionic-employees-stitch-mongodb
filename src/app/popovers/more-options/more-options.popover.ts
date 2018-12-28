import { EventModalComponent } from './../../modals/event-modal/event.modal';
import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';

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
              private navParams: NavParams, private iziToast: IziToastService, private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.event = this.navParams.data.popoverProps.event;
  }

  ngOnDestroy() {
  }

  updateItem() {
    console.log('MoreOptionsPopoverComponent::updateItem | method called');
    this.popoverCtrl.dismiss(this.event);
    this.presentModal();
  }

  async presentModal() {
    const componentProps = { modalProps: { title: 'Update event', event: this.event }};
    const modal = await this.modalCtrl.create({
      component: EventModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data presentModal', data);
    }
  }

  deleteItem() {
    console.log('MoreOptionsPopoverComponent::deleteItem | method called');

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        // console.log('objectId', objectId);

        this.stitchMongoService.updateEvents(config.COLLECTION_KEY, objectId, this.event.title)
        .then(docs => {
            // console.log(docs);
            this.iziToast.success('Delete event', 'Event deleted successfully.');
            this.popoverCtrl.dismiss(this.event);
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }

}
