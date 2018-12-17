import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController, LoadingController } from '@ionic/angular';

import { ShowPeoplePopoverComponent } from '../../popovers/show-people.popover';

import { StitchMongoService } from './../../services/stitch-mongo.service';

import config from '../../config/config';

@Component({
  selector: 'app-projects-modal',
  templateUrl: 'projects.modal.html',
  styleUrls: ['./projects.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectsModalComponent implements OnInit {

  projects: any = [];
  // technologies: any = [];
  people: any[] = [];
  loading: any;

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private popoverCtrl: PopoverController,
    private stitchMongoService: StitchMongoService, private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.presentLoading();
    // console.log(this.navParams.data.modalProps.projects);
    this.projects = this.navParams.data.modalProps.projects;
    // console.log('this.projects', this.projects);
    // this.technologies =  this.navParams.data.modalProps.projects..split(" ")

    Promise.all(
      this.projects.map(project => {
        return this.findPeople(project.name);
      })
    ).then(results => {
      // console.log('results', results);
      results.map((result, index) => {
        // console.log(result);
        this.people.push(result);
        setTimeout(() => this.dismissLoading(), 1000);
      });
    });
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  showPeople(projectName) {
    console.log('ProjectsModalComponent::showPeople() | method called', projectName);
    this.presentPopover(projectName);
  }

  async presentPopover(/*event*/projectName) {
    const componentProps = { popoverProps: { projectName: projectName}};
    const popover = await this.popoverCtrl.create({
      component: ShowPeoplePopoverComponent,
      componentProps: componentProps
      // event: event
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
      this.dismiss();
    }

  }

  async findPeople(projectName) {
      return this.stitchMongoService.find(config.COLLECTION_KEY, {'projects.name' : { $in : [projectName]}});
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait, loading...',
    });

    return await this.loading.present();
  }

  async dismissLoading() {
    this.loadingCtrl.dismiss();
    this.loading = null;
  }

}
