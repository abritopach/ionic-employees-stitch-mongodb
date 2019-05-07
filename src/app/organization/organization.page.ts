import { Component, OnInit } from '@angular/core';
import { ChartModalComponent } from '../modals/chart-modal/chart-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.page.html',
  styleUrls: ['./organization.page.scss'],
})
export class OrganizationPage implements OnInit {

  // https://codepen.io/siiron/pen/aLkdE
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async presentModal() {
    // const componentProps = { modalProps: { title: 'Projects', projects: this.employee.projects}};
    const modal = await this.modalCtrl.create({
      component: ChartModalComponent,
      // componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
    }
  }

}
