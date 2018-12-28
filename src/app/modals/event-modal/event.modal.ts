import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { StitchMongoService, IziToastService } from './../../services';
import config from '../../config/config';
import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';


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
      title: new FormControl('', Validators.required),
      fromTime: new FormControl('', Validators.required),
      untilTime: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      participants: new FormControl('', Validators.required),
    });
  }

  eventFormSubmit() {
    console.log('EventModalComponent::eventFormSubmit | method called');
    console.log(this.eventForm.value);

    this.presentLoading();
    this.eventForm.value.time = this.eventForm.value.fromTime + ' - ' + this.eventForm.value.untilTime;

    const meeting_participants = this.eventForm.value.participants.map(participant =>  {
      const p = {avatar: participant};
      return p;
    });

    this.eventForm.value.meeting_participants = meeting_participants;

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        console.log('objectId', objectId);
        // Update event.
        if (typeof this.navParams.data.modalProps.event !== 'undefined') {
          console.log('Update event');
          // TODO: Update event info.
        } else { // Add new event.
          this.stitchMongoService.updateOne(config.COLLECTION_KEY, objectId, this.eventForm.value).then(result => {
            console.log('result', result);
            this.dismissLoading();
            this.dismiss();
            this.iziToast.success('Add event', 'Event added successfully.');
          });
        }
      }
    });

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
