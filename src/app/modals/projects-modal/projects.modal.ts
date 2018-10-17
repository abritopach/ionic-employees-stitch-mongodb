import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-projects-modal',
  templateUrl: 'projects.modal.html',
  styleUrls: ['./projects.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectsModalComponent implements OnInit {

  projects: any = [];
  // technologies: any = [];

  constructor(private modalCtrl: ModalController, private navParams: NavParams, ) {
  }

  ngOnInit() {
    console.log(this.navParams.data.modalProps.projects);
    this.projects = this.navParams.data.modalProps.projects;
    // this.technologies =  this.navParams.data.modalProps.projects..split(" ")
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

}
