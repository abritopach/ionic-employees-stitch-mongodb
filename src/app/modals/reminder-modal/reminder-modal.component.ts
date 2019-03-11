import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'app-reminder-modal',
  templateUrl: './reminder-modal.component.html',
  styleUrls: ['./reminder-modal.component.scss'],
})
export class ReminderModalComponent implements OnInit {

  modalTitle: '';
  reminderForm: FormGroup;
  showHourItems = true;
  showLocationItems = false;

  dateOptions = {
    today: moment().toDate(),
    tomorrow: moment(new Date()).add(1, 'days').toDate(),
    nextMonday: moment(new Date()).add(7, 'days').toDate()
  };

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.modalTitle = this.navParams.data.modalProps.title;
  }

  createForm() {
    this.reminderForm = this.formBuilder.group({
      hourCheckbox: new FormControl('', Validators.required),
      locationCheckbox: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      hour: new FormControl('', Validators.required),
      frequency: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      customDate: new FormControl('', Validators.required),
    });
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  reminderFormSubmit() {
    console.log('ReminderModalComponent::reminderFormSubmit() | method called', this.reminderForm.value);
  }

  ionChangeHour(event) {
    console.log('ReminderModalComponent::ionChangeHour() | method called', event);
    this.showLocationItems = !this.showLocationItems;
  }

  ionChangeLocation(event) {
    console.log('ReminderModalComponent::ionChangeLocation() | method called', event);
    this.showHourItems = !this.showHourItems;
  }

  selectedDate(date) {
    console.log('ReminderModalComponent::selectedDate() | method called', date);
  }

  selectedHour(hour) {
    console.log('ReminderModalComponent::selectedHour() | method called', hour);
  }

  selectedFrequency(frequency) {
    console.log('ReminderModalComponent::selectedFrequency() | method called', frequency);
  }
}
