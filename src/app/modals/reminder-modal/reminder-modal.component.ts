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
  note: Note;

  dateOptions = {
    today: moment().format('DD-MM-YYYY'), // moment().toDate(),
    tomorrow: moment(new Date()).add(1, 'days').format('DD-MM-YYYY'),
    nextMonday: moment(new Date()).add(7, 'days').format('DD-MM-YYYY')
  };

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
        this.reminderForm.patchValue({date: this.note.reminder['date'], hour: this.note.reminder['hour'],
                                    frequency: this.note.reminder['frequency']});
      }
      if (this.note.reminder['type'] === 'location') {
        this.showHourItems = false;
        this.showLocationItems = true;
        this.reminderForm.patchValue({location: this.note.reminder['location']});
      }
    }
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
      reminder = {type: 'hour', date: this.reminderForm.value.date, hour: this.reminderForm.value.hour,
                  frequency: this.reminderForm.value.frequency};
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
