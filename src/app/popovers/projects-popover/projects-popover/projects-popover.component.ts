import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-projects-popover',
  templateUrl: './projects-popover.component.html',
  styleUrls: ['./projects-popover.component.scss'],
})
export class ProjectsPopoverComponent implements OnInit {

  selectedProjects = [];
  projects = [
    { name: 'Project Marketing 1', description: 'Description 1', technologies: 'Video 360', thumbnail: ''},
    { name: 'Project Marketing 2', description: 'Description 2', technologies: 'Video 360', thumbnail: ''},
    { name: 'Project Technical 1', description: 'Description 1', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''},
    { name: 'Project Technical 2', description: 'Description 2', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''},
    { name: 'Project Technical 3', description: 'Description 3', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''},
    { name: 'Project Technical 4', description: 'Description 4', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''},
    { name: 'Project Technical 5', description: 'Description 5', technologies: 'Ionic, Angular, MongoDB', thumbnail: ''},
  ];

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  onClickAccept() {
    console.log(this.selectedProjects);
    this.popoverCtrl.dismiss(this.selectedProjects);
  }

}
