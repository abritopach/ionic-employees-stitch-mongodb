import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalController, NavParams, PopoverController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import * as moment from 'moment';

import { FrequencyComponent } from '../../popovers/frequency/frequency.component';

import { GeolocationService } from '../../services/geolocation.service';
import { Note } from '../../models/note.model';
import { Frequency } from '../../models/frequency.model';

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
  @ViewChild('location') locationElementRef: ElementRef;
  loading: any;
  note: Note;
  frequencyPopoverData = null;
  updatedFrequency = false;

  dateOptions = {
    today: {text: 'today', date: moment().format('YYYY-MM-DD')},
    tomorrow: {text: 'tomorrow', date: moment(new Date()).add(1, 'days').format('YYYY-MM-DD')},
    nextMonday: {text: 'nextMonday', date: moment(new Date()).add(7, 'days').format('YYYY-MM-DD')},
    selectDate: {text: 'Select date...', date: ''}
  };

  hourOptions = {
    tomorrow: {text: 'tomorrow', hour: '8:00'},
    midday: {text: 'midday', hour: '13:00'},
    afternoon: {text: 'afternoon', hour: '18:00'},
    night: {text: 'night', hour: '20:00'},
    selectHour: {text: 'Select hour...', hour: ''}
  };

  frequencyOptions = {
    noRepetition: {text: 'noRepetition'},
    daily: {text: 'daily', value: 'days'},
    weekly: {text: 'weekly', value: 'weeks'},
    monthly: {text: 'monthly', value: 'months'},
    annually: {text: 'annually', value: 'years'},
    customize: {text: 'Customize...'}
  };
  frequencyTexts = ['noRepetition', 'daily', 'weekly', 'monthly', 'annually'];

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private formBuilder: FormBuilder,
              private popoverCtrl: PopoverController, private loadingCtrl: LoadingController,
              private geolocationService: GeolocationService) {
    this.createForm();
  }

  ngOnInit() {
    this.modalTitle = this.navParams.data.modalProps.title;
    this.note = this.navParams.data.modalProps.note;
    if (typeof this.note.reminder !== 'undefined') {
      if (this.note.reminder.type === 'hour') {
        this.showHourItems = true;
        this.showLocationItems = false;

        this.dateOptions.selectDate.text = this.note.reminder.date;
        this.hourOptions.selectHour.text = this.note.reminder.hour;

        let frequency = '';
        if ((typeof this.note.reminder.frequency !== 'undefined') && (typeof this.note.reminder.frequency === 'object')) {
          this.formatCustomizeText(this.note.reminder.frequency);
          frequency = this.frequencyOptions.customize.text;
        } else {
          frequency = this.note.reminder.frequency;
        }

        this.reminderForm.patchValue({date: this.dateOptions.selectDate.text, hour: this.hourOptions.selectHour.text,
          frequency: frequency });
      }
      if (this.note.reminder.type === 'location') {
        this.showHourItems = false;
        this.showLocationItems = true;
        this.reminderForm.patchValue({location: this.note.reminder.location});
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
      date: new FormControl(this.dateOptions.today.text, Validators.required),
      hour: new FormControl(this.hourOptions.midday.text, Validators.required),
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
      if (this.frequencyPopoverData !== null) {
        reminder = {type: 'hour', date: this.reminderForm.value.date, hour: this.reminderForm.value.hour,
                  frequency: this.frequencyPopoverData};
      }
    }
    if (this.reminderForm.value.locationCheckbox) {
      reminder = {type: 'location', location: this.reminderForm.value.location};
    }
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

    if ((date !== this.dateOptions.today.text) && (date !== this.dateOptions.tomorrow.text) &&
    (date !== this.dateOptions.nextMonday.text)) {
      this.datePicker.open();
    } else {
      this.dateOptions.selectDate.text = 'Select date...';
    }
  }

  selectedHour(hour) {
    console.log('ReminderModalComponent::selectedHour() | method called', hour);

    if ((hour !== this.hourOptions.tomorrow.text) && (hour !== this.hourOptions.midday.text)
    && (hour !== this.hourOptions.afternoon.text) && (hour !== this.hourOptions.night.text)) {
      this.hourPicker.open();
    } else {
      this.hourOptions.selectHour.text = 'Select hour...';
    }
  }

  selectedFrequency(frequency) {
    console.log('ReminderModalComponent::selectedFrequency() | method called', frequency);
    if ((this.frequencyTexts.indexOf(frequency) === -1) && (this.updatedFrequency === false)) {
      this.presentPopover();
    } else {
      this.updatedFrequency = false;
    }
  }

  changeCustomDate(event) {
    console.log('ReminderModalComponent::changeCustomDate() | method called', event.detail.value);
    this.dateOptions.selectDate.text = event.detail.value.toString();
    setTimeout(() => this.reminderForm.patchValue({date: this.dateOptions.selectDate.text}), 1000);
  }

  changeCustomHour(event) {
    console.log('ReminderModalComponent::changeCustomHour() | method called', event.detail.value);
    this.hourOptions.selectHour.text = event.detail.value.toString();
    setTimeout(() => this.reminderForm.patchValue({hour: this.hourOptions.selectHour.text}), 1000);
  }

  async presentPopover() {
    let frequency = null;
    if (typeof this.note.reminder !== 'undefined') {
      frequency = this.note.reminder.frequency;
    }
    const componentProps = { popoverProps: {frequency: frequency}};
    const popover = await this.popoverCtrl.create({
      component: FrequencyComponent,
      componentProps: componentProps
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
      this.formatCustomizeText(data);
      this.frequencyPopoverData = data;
      this.updatedFrequency = true;
      setTimeout(() => this.reminderForm.patchValue({frequency: this.frequencyOptions.customize.text }), 1000);
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

  formatCustomizeText(frequency: Frequency) {
    // se repite cada 2 semanas el lunes, martes
    // se repite a diario / se repite cada x días / se repite cada x días; hasta el dd/mm / se repite cada x días; y veces

    let when = '';
    if (frequency.when['text'] === 'numberEvents') {
      when = '; ' + frequency.when['value'] + ' times';
    }

    if (frequency.when['text'] === 'untilDate') {
      when = '; until ' +  moment(frequency.when['value']).format('YYYY-MM-DD');
    }

    if ((frequency.repeat === 'daily') || (frequency.repeat === 'annually')) {
      this.frequencyOptions.customize.text = `Is repeated every ${frequency.count}
      ${this.frequencyOptions[frequency.repeat].value} ${when}`;
    }
    if (frequency.repeat === 'weekly') {

      let days = '';
      Object.keys(frequency.days).forEach(day => {
        // console.log('day', day); // key
        // console.log('value', frequency.days[day]); // value
        if (frequency.days[day]) {
          days += day.substring(0, 3).toString() + '. ';
        }
      });

      this.frequencyOptions.customize.text = `Is repeated every ${frequency.count}
          ${this.frequencyOptions[frequency.repeat].value} on ${days} ${when}`;
    }

    if (frequency.repeat === 'monthly') {
      let condition = '';
      if (frequency.condition['text'] === 'thirdTuesday') {
        condition = 'The third Tuesday of the month';
      }
      if (frequency.condition['text'] === 'sameDay') {
        condition = 'The same day of the month';
      }
      this.frequencyOptions.customize.text = `Is repeated every ${frequency.count}
          ${this.frequencyOptions[frequency.repeat].value} (${condition}) ${when}`;
    }
  }

}
