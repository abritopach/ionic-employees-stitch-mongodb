import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { StitchMongoService, IziToastService } from './../../services';
import config from '../../config/config';
import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';

import * as moment from 'moment';


@Component({
  selector: 'app-event-modal',
  templateUrl: 'event.modal.html',
  styleUrls: ['./event.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventModalComponent implements OnInit {

  eventForm: FormGroup;
  currentYear = new Date().getFullYear();
  currentDate =  new Date();
  employees: any;
  loading: any;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private stitchMongoService: StitchMongoService,
              private storage: Storage, private iziToast: IziToastService, private loadingCtrl: LoadingController,
              private navParams: NavParams) {
    this.createForm();
  }

  ngOnInit() {
    this.fetchEmployees();
    if (typeof this.navParams.data.modalProps.event !== 'undefined') {
      this.eventForm.patchValue(this.navParams.data.modalProps.event);
    }
  }

  createForm() {
    this.eventForm = this.formBuilder.group({
      _id: new FormControl(''),
      title: new FormControl('', Validators.required),
      fromTime: new FormControl('', Validators.required),
      untilTime: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      participants: new FormControl('', Validators.required),
      time: new FormControl(''),
      meeting_participants: new FormControl('')
    });
  }

  eventFormSubmit() {
    console.log('EventModalComponent::eventFormSubmit | method called');
    console.log(this.eventForm.value);

    this.eventForm.value.time = this.eventForm.value.fromTime + ' - ' + this.eventForm.value.untilTime;

    const meeting_participants = this.eventForm.value.participants.map(participant =>  {
      const p = {avatar: participant};
      return p;
    });

    this.eventForm.value.meeting_participants = meeting_participants;

    const from = moment(this.eventForm.value.fromTime, 'HH:mm p');
    const until = moment(this.eventForm.value.untilTime, 'HH:mm p');

    if (from.isSameOrAfter(until)) {
      this.iziToast.show('Error', 'The start time of the event cannot be the same or later than the end time.',
       'red', 'ico-error', 'assets/avatar.png');
    } else {
      this.presentLoading();
      this.storage.get(config.TOKEN_KEY).then(res => {
        if (res) {
          const objectId = new ObjectId(res);
          console.log('objectId', objectId);
          // Update event.
          if (typeof this.navParams.data.modalProps.event !== 'undefined') {
            console.log('Update event');
            // this.stitchMongoService.updateEvent(config.COLLECTION_KEY, objectId, this.eventForm.value).then(result => {
            this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'events._id': this.eventForm.value._id},
            { $set: { 'events.$' : this.eventForm.value } }).then(result => {
              console.log('result', result);
              this.dismissLoading();
              this.dismiss();
              this.iziToast.success('Update event', 'Event updated successfully.');
            });
          } else { // Add new event.
            // Add id event.
            this.eventForm.value._id = new ObjectId();
            // this.stitchMongoService.updateOne(config.COLLECTION_KEY, objectId, this.eventForm.value).then(result => {
            this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId}, {$push: { events: this.eventForm.value }})
            .then(result => {
              console.log('result', result);
              this.dismissLoading();
              this.dismiss();
              this.iziToast.success('Add event', 'Event added successfully.');
            });
          }
        }
      });
    }
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss(this.eventForm.value);
  }

  fetchEmployees() {
    this.stitchMongoService.find(config.COLLECTION_KEY, {})
    .then(docs => {
      this.employees = docs;
    });
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait, adding event...',
    });

    return await this.loading.present();
  }

  async dismissLoading() {
    this.loading.dismiss();
    this.loading = null;
  }

}
