import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.page.html',
  styleUrls: ['./organization.page.scss'],
})
export class OrganizationPage implements OnInit {

  currentYear = new Date().getFullYear();

  // https://codepen.io/siiron/pen/aLkdE
  constructor() { }

  ngOnInit() {
  }

}
