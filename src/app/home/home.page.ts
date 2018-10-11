import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Stitch, RemoteMongoClient, AnonymousCredential} from 'mongodb-stitch-browser-sdk';

import { StitchMongoServiceService} from '../services/stitch-mongo-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  currentYear = new Date().getFullYear();
  employees: any;

  constructor(private router: Router, private stichMongoService: StitchMongoServiceService) {
    console.log('HomePage::constructor() | method called');
    console.log('employees', this.employees);

    stichMongoService.initializeAppCliente('ionic-employees-priuv');
    stichMongoService.getServiceClient('mongo-employees');

    stichMongoService.client.auth.loginWithCredential(new AnonymousCredential()).then(user =>
      stichMongoService.find('employees')
    )/*.then(() =>
      db.collection('employees').find({owner_id: client.auth.user.id}, { limit: 100}).asArray()
    )*/.then(docs => {
        // Collection is empty.
        if (docs.length === 0) {
          console.log('Collection is empty');
          stichMongoService.populateFakeEmployees();
        } else {
          console.log('Found docs', docs);
          this.employees = docs;
        }
        console.log('[MongoDB Stitch] Connected to Stitch');
    }).catch(err => {
        console.error(err);
    });

  }

  viewEmployeeDetails(employee) {
    console.log('HomePage::viewEmployeeDetails() | method called');
    this.router.navigateByUrl(`/detail`);
  }
}
