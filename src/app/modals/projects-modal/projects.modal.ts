import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, NavParams, PopoverController } from '@ionic/angular';

import { ShowPeoplePopoverComponent } from '../../popovers/show-people.popover';

import { StitchMongoService } from './../../services/stitch-mongo.service';
import { AnonymousCredential} from 'mongodb-stitch-browser-sdk';

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

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private popoverCtrl: PopoverController,
    private stitchMongoService: StitchMongoService) {
  }

  ngOnInit() {
    // console.log(this.navParams.data.modalProps.projects);
    this.projects = this.navParams.data.modalProps.projects;
    console.log('this.projects', this.projects);
    this.projects.map(project => this.findPeople(project.name));
    console.log('this.people', this.people);
    // this.technologies =  this.navParams.data.modalProps.projects..split(" ")
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

  findPeople(projectName) {
    this.stitchMongoService.client.auth.loginWithCredential(new AnonymousCredential()).then(user =>
      this.stitchMongoService.find('employees', {'projects.name' : { $in : [projectName]}})
    ).then(docs => {
        // Collection is empty.
        if (docs.length === 0) {
          console.log('Collection is empty');
        } else {
          console.log('Found docs in findPeople', docs);
          this.people.push(docs);
        }
        console.log('[MongoDB Stitch] Connected to Stitch');
    }).catch(err => {
        console.error(err);
    });
  }

}
