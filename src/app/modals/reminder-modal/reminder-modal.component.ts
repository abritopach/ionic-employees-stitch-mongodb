import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalController, NavParams, PopoverController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import * as moment from 'moment';

import { FrequencyComponent } from '../../popovers/frequency/frequency.component';

import { GeolocationService } from '../../services/geolocation.service';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-reminder-modal',
  templateUrl: './reminder-modal.component.html',
  styleUrls: ['./reminder-modal.component.scss'],
})
export class ReminderModalComponent implements OnInit, AfterViewInit {

  currentYear = new Date().getFullYear();
  modalTitle: '';
  reminderForm: FormGroup;
  showHourItems = true;
  showLocationItems = false;
  @ViewChild('datePicker') datePicker;
  @ViewChild('hourPicker') hourPicker;
  hiddenCustomHour = true;
  @ViewChild('location') locationElementRef: ElementRef;
  loading: any;
  note: Note;
  frequencyPopoverData = null;

  dateOptions = {
    today: moment().format('YYYY-MM-DD'), // moment().toDate(),
    tomorrow: moment(new Date()).add(1, 'days').format('YYYY-MM-DD'),
    nextMonday: moment(new Date()).add(7, 'days').format('YYYY-MM-DD'),
    selectDate: 'Select date...'
  };

  customize = 'Customize...';
  frequencyTexts = ['noRepetition', 'daily', 'weekly', 'monthly', 'annually'];

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private formBuilder: FormBuilder,
              private popoverCtrl: PopoverController, private loadingCtrl: LoadingController,
              private geolocationService: GeolocationService) {
    this.createForm();
  }

  ngOnInit() {
    this.modalTitle = this.navParams.data.modalProps.title;
    console.log('this.reminderForm', this.reminderForm.value);
    this.note = this.navParams.data.modalProps.note;
    console.log('note', this.note);
    if (typeof this.note.reminder !== 'undefined') {
      if (this.note.reminder['type'] === 'hour') {
        this.showHourItems = true;
        this.showLocationItems = false;
        this.hiddenCustomHour = false;

        if (typeof this.note.reminder['frequency'] !== 'undefined') {
          console.log('*****Frequency not empty');
          // se repite cada 2 semanas el lunes, martes
          // TODO: Complete string.
          this.customize = `Is repeated every ${this.note.reminder['frequency']['count']} weeks on`;
        }

        this.reminderForm.patchValue({date: 'Select date...', hour: 'selectHour',
                                    frequency: this.customize, customDate: this.note.reminder['date'],
                                    customHour: this.note.reminder['hour'] });
      }
      if (this.note.reminder['type'] === 'location') {
        this.showHourItems = false;
        this.showLocationItems = true;
        this.reminderForm.patchValue({location: this.note.reminder['location']});
      }
    }
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
      hourCheckbox: new FormControl(true),
      locationCheckbox: new FormControl(false),
      date: new FormControl(this.dateOptions.today, Validators.required),
      hour: new FormControl('13:00', Validators.required),
      frequency: new FormControl('noRepetition', Validators.required),
      location: new FormControl(''),
      customDate: new FormControl(''),
      customHour: new FormControl(''),
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
    let reminder = {};
    if (this.reminderForm.value.hourCheckbox) {

      let date = this.reminderForm.value.date;
      if (this.reminderForm.value.date === 'selectDate') {
        date = this.reminderForm.value.customDate;
      }
      console.log('date', date);

      let hour = this.reminderForm.value.hour;
      if (this.reminderForm.value.hour === 'selectHour') {
        hour = this.reminderForm.value.customHour;
      }
      console.log('hour', hour);

      reminder = {type: 'hour', date: date, hour: hour,
                  frequency: this.reminderForm.value.frequency};
      if (this.frequencyPopoverData !== null) {
        reminder = {type: 'hour', date: date, hour: hour,
                  frequency: this.frequencyPopoverData};
      }
    }
    if (this.reminderForm.value.locationCheckbox) {
      reminder = {type: 'location', location: this.reminderForm.value.location};
    }
    console.log('reminder', reminder);
    this.modalCtrl.dismiss( {option: 'reminder', reminder: reminder} );
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

    if ((date !== this.dateOptions.today) && (date !== this.dateOptions.tomorrow) && (date !== this.dateOptions.nextMonday)) {
      this.datePicker.open();
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
    if (this.frequencyTexts.indexOf(frequency) === -1) {
      this.presentPopover();
    }
  }

  changeCustomDate(event) {
    console.log('ReminderModalComponent::changeCustomDate() | method called', event.detail.value);
    this.dateOptions.selectDate = event.detail.value.toString();
    setTimeout(() => this.reminderForm.patchValue({date: this.dateOptions.selectDate}), 1000);
  }

  changeCustomHour(event) {
    console.log('ReminderModalComponent::changeCustomHour() | method called', event.detail.value);
    this.hiddenCustomHour = false;
  }

  async presentPopover() {
    const componentProps = { popoverProps: {frequency: this.note.reminder['frequency']}};
    const popover = await this.popoverCtrl.create({
      component: FrequencyComponent,
      componentProps: componentProps
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
      this.frequencyPopoverData = data;
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
