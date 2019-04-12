import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Holiday } from '../../models/holiday.model';

@Component({
  selector: 'app-history-holidays-modal',
  templateUrl: './history-holidays-modal.component.html',
  styleUrls: ['./history-holidays-modal.component.scss'],
})
export class HistoryHolidaysModalComponent implements OnInit {

  holidays: Holiday;
  pendingRequests: any[] = [];
  approvedRequests: any[] = [];

  constructor(private modalCtrl: ModalController, private navParams: NavParams) { }

  ngOnInit() {
    if (typeof this.navParams.data.modalProps.holidays !== 'undefined') {
      this.holidays = this.navParams.data.modalProps.holidays;
      this.pendingRequests = this.holidays.taken.info.filter(h => h.status === 'pending');
      this.approvedRequests = this.holidays.taken.info.filter(h => h.status === 'approved');
      console.log('pendingRequests', this.pendingRequests);
      console.log('approvedRequests', this.approvedRequests);
    }
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  updateHolidays() {
    console.log('HistoryHolidaysModalComponent::updateHolidays() | method called');
  }

}
