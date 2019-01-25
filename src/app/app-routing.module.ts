import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', data: { employee: 'hola' } },
  // { path: 'detail', loadChildren: './detail/detail.module#DetailPageModule', data: {name: 'foo', age: 23} }
  { path: 'detail/:id', canActivate: [AuthGuardService], loadChildren: './detail/detail.module#DetailPageModule' },
  { path: 'organization', canActivate: [AuthGuardService], loadChildren: './organization/organization.module#OrganizationPageModule' },
  { path: 'schedule', canActivate: [AuthGuardService], loadChildren: './schedule/schedule.module#SchedulePageModule' },
  { path: 'login', loadChildren: './public/login/login.module#LoginPageModule' },
  { path: 'products', loadChildren: './products/products.module#ProductsPageModule' },
  { path: 'todo', loadChildren: './todo/todo.module#TodoPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
