import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrganizationPage } from './organization.page';

import { OrganizationChartComponent } from '../components/organization-chart/organization-chart.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OrganizationPage, OrganizationChartComponent],
  entryComponents: [OrganizationChartComponent]
})
export class OrganizationPageModule {}
