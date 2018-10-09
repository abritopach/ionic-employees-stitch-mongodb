import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  currentYear = new Date().getFullYear();
  employees = [
    {'employee_name': 'Adrián Brito Pacheco', 'job_position': 'Project Manager', 'avatar': 'http://i.pravatar.cc/150?img=1',
     'description': 'Description'},
    {'employee_name': 'José Antonio Pérez Florencia', 'job_position': 'Software Developer', 'avatar': 'http://i.pravatar.cc/150?img=2',
    'description': 'Description'}
  ];
  
}
