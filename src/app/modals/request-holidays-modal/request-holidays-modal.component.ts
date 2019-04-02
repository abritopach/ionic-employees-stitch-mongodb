import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import config from '../../config/config';
import { StitchMongoService } from '../../services/stitch-mongo.service';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { ObjectId } from 'bson';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { Holiday } from '../../models/holiday.model';

@Component({
  selector: 'app-request-holidays-modal',
  templateUrl: './request-holidays-modal.component.html',
  styleUrls: ['./request-holidays-modal.component.scss'],
})
export class RequestHolidaysModalComponent implements OnInit {

  requestHolidaysForm: FormGroup;
  employees: any;
  holidays: Holiday;

  constructor(private formBuilder: FormBuilder, private stitchMongoService: StitchMongoService, private modalCtrl: ModalController,
              private storage: Storage, private navParams: NavParams) {
    this.createForm();
  }

  ngOnInit() {
    this.fetchEmployees();
    console.log('holydays', this.holidays);
  }

  createForm() {
    this.requestHolidaysForm = this.formBuilder.group({
      id: new FormControl(new ObjectId()),
      whoFor: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      reason: new FormControl('', Validators.required)
    });
  }

  requestHolidaysFormSubmit() {
    console.log(this.requestHolidaysForm.value);

          /*
    const startDate = moment(this.requestHolidaysForm.value.startDate, 'HH:mm p');
    const endDate = moment(this.requestHolidaysForm.value.endDate, 'HH:mm p');

    if (startDate.isSameOrAfter(endDate)) {
      this.iziToast.show('Error', 'The start time of the event cannot be the same or later than the end time.',
       'red', 'ico-error', 'assets/avatar.png');
    } else {
      this.storage.get(config.TOKEN_KEY).then(res => {
        if (res) {
          const objectId = new ObjectId(res);
          console.log('objectId', objectId);
          // Update holiday.
          if (typeof this.navParams.data.modalProps.event !== 'undefined') {
          } else { // Add new holiday.
            // this.presentLoading('Please wait, adding holiday...');
            this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId}, {$push: { holidays: this.eventForm.value }})
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
    */
  }

  fetchEmployees() {
    this.stitchMongoService.find(config.COLLECTION_KEY, {})
    .then(docs => {
      this.employees = docs;
      console.log('employees', this.employees);
    });
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

}
