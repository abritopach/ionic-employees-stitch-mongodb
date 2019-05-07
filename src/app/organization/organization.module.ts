import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OrganizationPage } from './organization.page';

import { OrganizationChartComponent } from '../components/organization-chart/organization-chart.component';
import { ChartModalComponent } from '../modals/chart-modal/chart-modal.component';

import { SharedComponentsModule } from '../components/shared-components.module';

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
    RouterModule.forChild(routes),
    SharedComponentsModule
  ],
  declarations: [OrganizationPage, OrganizationChartComponent, ChartModalComponent],
  entryComponents: [OrganizationChartComponent, ChartModalComponent]
})
export class OrganizationPageModule {}
