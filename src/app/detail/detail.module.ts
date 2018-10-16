import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailPage } from './detail.page';

import { EmployeesPerDepartmentComponent } from '../components/employees-per-department/employees-per-department.component';
import { ProjectsModalComponent } from '../modals/projects-modal/projects.modal';

const routes: Routes = [
  {
    path: '',
    component: DetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailPage, EmployeesPerDepartmentComponent, ProjectsModalComponent],
  entryComponents: [EmployeesPerDepartmentComponent, ProjectsModalComponent]
})
export class DetailPageModule {}
