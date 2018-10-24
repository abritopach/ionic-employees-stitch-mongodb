import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';

import { ShowPeoplePopoverComponent } from '../../popovers/show-people.popover';

@Component({
  selector: 'app-projects-modal',
  templateUrl: 'projects.modal.html',
  styleUrls: ['./projects.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectsModalComponent implements OnInit {

  projects: any = [];
  // technologies: any = [];

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
    // console.log(this.navParams.data.modalProps.projects);
    this.projects = this.navParams.data.modalProps.projects;
    // this.technologies =  this.navParams.data.modalProps.projects..split(" ")
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  showPeople() {
    console.log('ProjectsModalComponent::showPeople() | method called');
    this.presentPopover();
  }

  async presentPopover(/*event*/) {
    const popover = await this.popoverCtrl.create({
      component: ShowPeoplePopoverComponent,
      // event: event
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
    }

  }

}
