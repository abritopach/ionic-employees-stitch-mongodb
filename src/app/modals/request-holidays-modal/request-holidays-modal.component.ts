import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import config from '../../config/config';
import { StitchMongoService } from '../../services/stitch-mongo.service';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { ObjectId } from 'bson';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { Holiday } from '../../models/holiday.model';
import { IziToastService } from '../../services/izi-toast.service';

@Component({
  selector: 'app-request-holidays-modal',
  templateUrl: './request-holidays-modal.component.html',
  styleUrls: ['./request-holidays-modal.component.scss'],
})
export class RequestHolidaysModalComponent implements OnInit {

  requestHolidaysForm: FormGroup;
  employees: any;
  holidays: Holiday = {
    total: 22,
    not_taken: 22,
    taken: {days: 0, info: []},
  };
  loading: any;

  constructor(private formBuilder: FormBuilder, private stitchMongoService: StitchMongoService, private modalCtrl: ModalController,
              private storage: Storage, private navParams: NavParams, private loadingCtrl: LoadingController,
              private iziToast: IziToastService) {
    this.createForm();
  }

  ngOnInit() {
    this.fetchEmployees();
    if ((typeof this.navParams.data.modalProps.holidays !== 'undefined') && (this.navParams.data.modalProps.holidays !== null)) {
      this.holidays = this.navParams.data.modalProps.holidays;
      if (typeof this.navParams.data.modalProps.selectedHolidays !== 'undefined') {
        this.requestHolidaysForm.patchValue(this.navParams.data.modalProps.selectedHolidays.meta);
      }
    }
    console.log('holydays', this.holidays);
  }

  createForm() {
    this.requestHolidaysForm = this.formBuilder.group({
      id: new FormControl(new ObjectId()),
      whoFor: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      reason: new FormControl(''),
      status: new FormControl('pending'),
      countDays: new FormControl(0),
    });
  }

  requestHolidaysFormSubmit() {
    console.log(this.requestHolidaysForm.value);

    const startDate = moment(this.requestHolidaysForm.value.startDate, 'YYYY-MM-DD');
    const endDate = moment(this.requestHolidaysForm.value.endDate, 'YYYY-MM-DD');
    let weekendDays = 0;
    let countDays = Math.abs(startDate.diff(endDate, 'days')) + 1;
    console.log('countDays', countDays);

    for (const d = moment(startDate); d.diff(endDate) <= 0; d.add(1, 'days')) {
      // console.log('d', d.format('YYYY-MM-DD'));
      const weekday = d.format('dddd'); // Monday ... Sunday
      const isWeekend = weekday === 'Sunday' || weekday === 'Saturday';
      // console.log('isWeekend', isWeekend);
      if (isWeekend) { weekendDays += 1; }
    }
    countDays -= weekendDays;


    if (endDate.isSameOrAfter(startDate)) {

      if (countDays <= this.holidays.not_taken) {

        this.requestHolidaysForm.value.countDays = countDays;
        this.holidays.not_taken -= countDays;
        this.holidays.taken.days += countDays;

        if (typeof this.navParams.data.modalProps.selectedHolidays !== 'undefined') {
          this.holidays.taken.info = this.holidays.taken.info.filter(h => h.id !== this.navParams.data.modalProps.selectedHolidays.meta.id);
        }

        this.holidays.taken.info.push(this.requestHolidaysForm.value);

        console.log('holidays sent', this.holidays);

        this.storage.get(config.TOKEN_KEY).then(res => {
          if (res) {
            const objectId = new ObjectId(res);
            console.log('objectId', objectId);
            this.presentLoading('Please wait, adding holiday...');
            this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId}, {$set: { holidays: this.holidays }})
            .then(result => {
              console.log('result', result);
              this.dismissLoading();
              this.dismiss(this.holidays);
              this.iziToast.success('Holiday request', 'Holiday request sent successfully.');
            });
          }
        });
      } else {
        this.iziToast.show('Error', 'You dont have enough vacation days left.',
        'red', 'ico-error', 'assets/avatar.png');
      }
    } else {
      this.iziToast.show('Error', 'The end date cannot be earlier than the start date.',
       'red', 'ico-error', 'assets/avatar.png');
    }
  }

  fetchEmployees() {
    this.stitchMongoService.find(config.COLLECTION_KEY, {})
    .then(docs => {
      this.employees = docs;
      console.log('employees', this.employees);
    });
  }

  dismiss(info) {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss(info);
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

}
