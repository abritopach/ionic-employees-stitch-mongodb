import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule', data: { employee: 'hola' } },
  // { path: 'detail', loadChildren: './detail/detail.module#DetailPageModule', data: {name: 'foo', age: 23} }
  { path: 'detail/:id', loadChildren: './detail/detail.module#DetailPageModule' },
  { path: 'organization', loadChildren: './organization/organization.module#OrganizationPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
