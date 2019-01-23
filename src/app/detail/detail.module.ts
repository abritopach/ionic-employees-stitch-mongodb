import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailPage } from './detail.page';

import { EmployeesPerDepartmentComponent } from '../components/employees-per-department/employees-per-department.component';
import { ProjectsModalComponent } from '../modals/projects-modal/projects.modal';
import { SendSMSModalComponent } from './../modals/send-sms-modal/send-sms.modal';

import { SharedComponentsModule } from '../components/shared-components.module';

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
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  declarations: [DetailPage, EmployeesPerDepartmentComponent, ProjectsModalComponent, SendSMSModalComponent],
  entryComponents: [EmployeesPerDepartmentComponent, ProjectsModalComponent, SendSMSModalComponent]
})
export class DetailPageModule {}
