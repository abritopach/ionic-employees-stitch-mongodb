import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-upcoming-absences-modal',
  templateUrl: './upcoming-absences-modal.component.html',
  styleUrls: ['./upcoming-absences-modal.component.scss'],
})
export class UpcomingAbsencesModalComponent implements OnInit {

  view = 'month';

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  // exclude weekends
  excludeDays: number[] = [0, 6];

  public defaultColors: string[] = [
    '#ffffff',
    '#000105',
    '#3e6158',
  ];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

}
