import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalController, NavParams, PopoverController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import * as moment from 'moment';

import { FrequencyComponent } from '../../popovers/frequency/frequency.component';

import { GeolocationService } from '../../services/geolocation.service';

@Component({
  selector: 'app-reminder-modal',
  templateUrl: './reminder-modal.component.html',
  styleUrls: ['./reminder-modal.component.scss'],
})
export class ReminderModalComponent implements OnInit, AfterViewInit {

  modalTitle: '';
  reminderForm: FormGroup;
  showHourItems = true;
  showLocationItems = false;
  @ViewChild('datePicker') datePicker;
  @ViewChild('hourPicker') hourPicker;
  hiddenCustomDate = true;
  hiddenCustomHour = true;
  @ViewChild('location') locationElementRef: ElementRef;
  loading: any;

  dateOptions = {
    today: moment().toDate(),
    tomorrow: moment(new Date()).add(1, 'days').toDate(),
    nextMonday: moment(new Date()).add(7, 'days').toDate()
  };

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private formBuilder: FormBuilder,
              private popoverCtrl: PopoverController, private loadingCtrl: LoadingController,
              private geolocationService: GeolocationService) {
    this.createForm();
  }

  ngOnInit() {
    this.modalTitle = this.navParams.data.modalProps.title;
    console.log('this.reminderForm', this.reminderForm.value);
  }

  ngAfterViewInit() {
    console.log('ReminderModalComponent::ngAfterViewInit | method called');
    this.geolocationService.findAdress(this.locationElementRef);

    this.geolocationService.placeSubject.subscribe((result) => {
      console.log('result', result);
    });
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
      customHour: new FormControl('', Validators.required),
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
    if (date === 'selectDate') {
      this.datePicker.open();
    } else {
      this.hiddenCustomDate = true;
    }
  }

  selectedHour(hour) {
    console.log('selectedHour this.reminderForm', this.reminderForm.value);
    console.log('ReminderModalComponent::selectedHour() | method called', hour);
    if (hour === 'selectHour') {
      this.hourPicker.open();
    } else {
      this.hiddenCustomHour = true;
    }
  }

  selectedFrequency(frequency) {
    console.log('ReminderModalComponent::selectedFrequency() | method called', frequency);
    if (frequency === 'customize') {
      this.presentPopover();
    }
  }

  changeCustomDate(event) {
    console.log('ReminderModalComponent::changeCustomDate() | method called', event.detail.value);
    this.hiddenCustomDate = false;
  }

  changeCustomHour(event) {
    console.log('ReminderModalComponent::changeCustomHour() | method called', event.detail.value);
    this.hiddenCustomHour = false;
  }

  async presentPopover() {
    const componentProps = { popoverProps: {}};
    const popover = await this.popoverCtrl.create({
      component: FrequencyComponent,
      componentProps: componentProps
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
    }

  }

  async presentLoading(message) {
    this.loading = await this.loadingCtrl.create({
      message: message,
    });

    return await this.loading.present();
  }

  async dismissLoading() {
    this.loading.dismiss();
    this.loading = null;
  }

  locate() {
    console.log('ReminderModalComponent::locate | method called');
    this.geolocationService.getAddress().then(result => {
      this.reminderForm.patchValue({location: result['address']});
    });
  }

}
