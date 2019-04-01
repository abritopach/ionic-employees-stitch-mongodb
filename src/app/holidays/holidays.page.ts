import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { RequestHolidaysModalComponent } from '../modals/request-holidays-modal/request-holidays-modal.component';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.page.html',
  styleUrls: ['./holidays.page.scss'],
})
export class HolidaysPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  requestHolidays() {
    console.log('HolidaysPage::requestHolidays() | method called');
    this.presentModal();
  }

  async presentModal() {
    const componentProps = { modalProps: { title: 'Request time off' }};
    const modal = await this.modalCtrl.create({
      component: RequestHolidaysModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data presentModal', data);
    }
  }

}
