import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-projects-modal',
  templateUrl: 'projects.modal.html',
  styleUrls: ['./projects.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectsModalComponent implements OnInit {

  projects = [
    {name: 'Project 1', description: 'Description 1', technologies: 'Ionic, Angular, MongoDB'},
    {name: 'Project 2', description: 'Description 2', technologies: 'Ionic, Angular, MongoDB'},
    {name: 'Project 3', description: 'Description 3', technologies: 'Ionic, Angular, MongoDB'}
  ];

  constructor(private modalCtrl: ModalController, private navParams: NavParams, ) {
  }

  ngOnInit() {
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

}
