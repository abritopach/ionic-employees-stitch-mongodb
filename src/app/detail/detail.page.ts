import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StitchMongoService } from '../services/stitch-mongo.service';

import { ModalController } from '@ionic/angular';
import { ProjectsModalComponent } from '../modals/projects-modal/projects.modal';
import { SendSMSModalComponent } from './../modals/send-sms-modal/send-sms.modal';

import config from '../config/config';
import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';
import { IziToastService } from '../services/izi-toast.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  employee: any = null;

  constructor(private route: ActivatedRoute, private stichMongoService: StitchMongoService,
              private modalCtrl: ModalController, private storage: Storage, private stitchMongoService: StitchMongoService,
              private iziToast: IziToastService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // console.log('ionViewWillEnter');
    const empployeeId = this.route.snapshot.paramMap.get('id');
    console.log('employeeId', empployeeId);
    this.findEmployee(empployeeId);
  }

  findEmployee(employeId) {
    this.stichMongoService.find(config.COLLECTION_KEY, {'employee_name': employeId})
    .then(docs => {
        // Collection is empty.
        if (docs.length !== 0) {
          // console.log(docs);
          this.employee = docs[0];
        }
    }).catch(err => {
        console.error(err);
    });
  }

  onClickEmail(employee) {
    console.log('DetailPage::onClickEmail() | method called');
    const windowRef = window.open(`mailto:${employee.email}`, '_blank');

    windowRef.focus();

    setTimeout(function() {
      if (!windowRef.document.hasFocus()) {
          windowRef.close();
      }
    }, 500);
  }

  onClickCall(employee) {
    console.log('DetailPage::onClickCall() | method called');
    window.open(`tel:${employee.phone}`, '_system', 'location=yes');
  }

  onClickMessage() {
    console.log('DetailPage::onClickMessage() | method called');
    this.presentSendSMSModal();
  }

  async presentModal() {
    const componentProps = { modalProps: { title: 'Projects', projects: this.employee.projects}};
    const modal = await this.modalCtrl.create({
      component: ProjectsModalComponent,
      componentProps: componentProps
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
    }
  }

  async presentSendSMSModal() {
    const modal = await this.modalCtrl.create({
      component: SendSMSModalComponent
    });
    await modal.present();

    const {data} = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
    }
  }

  addToFavorites(employee) {
    console.log('DetailPage::addToFavorites() | method called', employee);
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId},
          {$push: { 'favorites': employee }})
          .then(result => {
            console.log('result', result);
            this.iziToast.success('Favorites', 'Employee added successfully to favorites list.');
          });
        }
    });
  }

}
