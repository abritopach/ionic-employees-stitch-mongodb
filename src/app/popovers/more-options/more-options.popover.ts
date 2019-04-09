import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { PopoverController, NavParams, ModalController} from '@ionic/angular';

import { StitchMongoService, IziToastService } from '../../services';
import config from '../../config/config';
import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';

import { EventModalComponent } from '../../modals/event-modal/event.modal';

@Component({
  selector: 'app-more-options-popover',
  templateUrl: 'more-options.popover.html',
  styleUrls: ['./more-options.popover.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MoreOptionsPopoverComponent implements OnInit, OnDestroy {

  options: any;
  event: any;

  constructor(private popoverCtrl: PopoverController, private navParams: NavParams, private modalCtrl: ModalController,
              private stitchMongoService: StitchMongoService, private iziToast: IziToastService, private storage: Storage) {
  }

  ngOnInit() {
    this.options = this.navParams.data.popoverProps.options;
    console.log(this.options);
    if (typeof this.navParams.data.popoverProps.event !== 'undefined') {
      this.event = this.navParams.data.popoverProps.event;
    }
  }

  ngOnDestroy() {
  }

  // Note list page options.

  /*****/
  deleteNote() {
    console.log('MoreOptionsPopoverComponent::deleteNote | method called');
    this.popoverCtrl.dismiss({option: 'deleteNote'});
  }

  archiveNote() {
    console.log('MoreOptionsPopoverComponent::archiveNote | method called');
    this.popoverCtrl.dismiss({option: 'archiveNote'});
  }

  deleteAllNotes() {
    console.log('MoreOptionsPopoverComponent::deleteAllNotes | method called');
    this.popoverCtrl.dismiss({option: 'deleteAllNotes'});
  }

  archiveAllNotes() {
    console.log('MoreOptionsPopoverComponent::archiveAllNotes | method called');
    this.popoverCtrl.dismiss({option: 'archiveAllNotes'});
  }

  unarchiveNote() {
    console.log('MoreOptionsPopoverComponent::unarchiveNote | method called');
    this.popoverCtrl.dismiss({option: 'unarchiveNote'});
  }

  tagNote() {
    console.log('MoreOptionsPopoverComponent::tagNote | method called');
    this.popoverCtrl.dismiss({option: 'tagNote'});
  }

  pinnedNote() {
    console.log('MoreOptionsPopoverComponent::pinnedNote | method called');
    this.popoverCtrl.dismiss({option: 'pinnedNote'});
  }

  createCopyNote() {
    console.log('MoreOptionsPopoverComponent::createCopyNote | method called');
    this.popoverCtrl.dismiss({option: 'createCopyNote'});
  }

  collaboratorNote() {
    console.log('MoreOptionsPopoverComponent::collaboratorNote | method called');
    this.popoverCtrl.dismiss({option: 'collaboratorNote'});
  }

  colourNote() {
    console.log('MoreOptionsPopoverComponent::colourNote | method called');
    this.popoverCtrl.dismiss({option: 'colourNote'});
  }

  reminderNote() {
    console.log('MoreOptionsPopoverComponent::reminderNote | method called');
    this.popoverCtrl.dismiss({option: 'reminderNote'});
  }

  shareNote() {
    console.log('MoreOptionsPopoverComponent::shareNote | method called');
    this.popoverCtrl.dismiss({option: 'shareNote'});
  }

  /*****/

  // Todo page options.

  /*****/

  deselectAll() {
    console.log('MoreOptionsPopoverComponent::deselectAll | method called');
    this.popoverCtrl.dismiss({option: 'deselect'});
  }

  deleteSelected() {
    console.log('MoreOptionsPopoverComponent::deleteSelected | method called');
    this.popoverCtrl.dismiss({option: 'delete'});
  }

  /*****/


  // Schedule page options.

  /*****/
  updateItem() {
    console.log('MoreOptionsPopoverComponent::updateItem | method called');
    // TODO: Add _id field to events.
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
      this.popoverCtrl.dismiss({option: 'update', event: data});
    }
  }

  deleteItem() {
    console.log('MoreOptionsPopoverComponent::deleteItem | method called');

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        // console.log('objectId', objectId);
        // this.stitchMongoService.updateEvents(config.COLLECTION_KEY, objectId, this.event.title)
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId}, {$pull: { events: { title: this.event.title } }})
        .then(docs => {
            // console.log(docs);
            this.iziToast.success('Delete event', 'Event deleted successfully.');
            this.popoverCtrl.dismiss({option: 'delete', event: this.event});
        }).catch(err => {
            console.error(err);
        });
      }
    });
  }
  /*****/

  /*****/


  // Holidays page options.

  /*****/


  updateHolidays() {
    console.log('MoreOptionsPopoverComponent::updateHolidays | method called');
  }

  deleteHolidays() {
    console.log('MoreOptionsPopoverComponent::deleteHolidays | method called');
  }

}
