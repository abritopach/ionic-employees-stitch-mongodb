import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { StitchMongoService } from '../services/stitch-mongo.service';

import { AnonymousCredential} from 'mongodb-stitch-browser-sdk';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ModalController } from '@ionic/angular';
import { ProjectsModalComponent } from '../modals/projects-modal/projects.modal';
import { SendSMSModalComponent } from './../modals/send-sms-modal/send-sms.modal';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  employee: any = null;

  constructor(private route: ActivatedRoute, private stichMongoService: StitchMongoService,
              private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // console.log('ionViewWillEnter');
    const empployeeId = this.route.snapshot.paramMap.get('id');
    console.log('employeeId', empployeeId);
    this.findEmployee(empployeeId);
  }

  findEmployee(employeId) {
    this.stichMongoService.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log('user', user);
      return this.stichMongoService.find('employees', {'employee_name': employeId});
      }
    ).then(docs => {
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
    console.log('HomePage::onClickEmail() | method called');
    const windowRef = window.open(`mailto:${employee.email}`, '_blank');

    windowRef.focus();

    setTimeout(function() {
      if (!windowRef.document.hasFocus()) {
          windowRef.close();
      }
    }, 500);
  }

  onClickCall(employee) {
    console.log('HomePage::onClickCall() | method called');
    window.open(`tel:${employee.phone}`, '_system', 'location=yes');
  }

  onClickMessage() {
    console.log('HomePage::onClickMessage() | method called');
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

}
