import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Stitch, RemoteMongoClient, AnonymousCredential} from 'mongodb-stitch-browser-sdk';

import { StitchMongoServiceService} from '../services/stitch-mongo-service.service';

import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  currentYear = new Date().getFullYear();
  employees: any;
  searchControl: FormControl;

  constructor(private router: Router, private stichMongoService: StitchMongoServiceService, private route: ActivatedRoute) {
    console.log('HomePage::constructor() | method called');
    console.log('employees', this.employees);

    this.searchControl = new FormControl();

    this.stichMongoService.initializeAppCliente('ionic-employees-priuv');
    this.stichMongoService.getServiceClient('mongo-employees');

    this.fetchEmployees();

  }

  ionViewWillEnter() {
    console.log('HomePage::ionViewWillEnter | method called');
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      if (search === '') {
        console.log('search is empty');
        this.fetchEmployees();
      } else {
        console.log('search is not empty');
        this.stichMongoService.client.callFunction('search', search)
        .then(employees => console.log('success: ', employees))
          .catch(e => console.log('error: ', e));
      }
    });

  }

  viewEmployeeDetails(employee) {
    console.log('HomePage::viewEmployeeDetails() | method called');
    this.router.navigateByUrl('/detail');
  }

  searchEmployees(ev: any) {
    console.log('HomePage::searchMovies() | method called', ev.target.value);
  }

  cancelSearch(ev: any) {
    console.log('HomePage::cancelSearch() | method called');
  }

  fetchEmployees() {
    this.stichMongoService.client.auth.loginWithCredential(new AnonymousCredential()).then(user =>
      this.stichMongoService.find('employees', {})
    )/*.then(() =>
      db.collection('employees').find({owner_id: client.auth.user.id}, { limit: 100}).asArray()
    )*/.then(docs => {
        // Collection is empty.
        if (docs.length === 0) {
          console.log('Collection is empty');
          this.stichMongoService.populateFakeEmployees();
        } else {
          console.log('Found docs', docs);
          this.employees = docs;
        }
        console.log('[MongoDB Stitch] Connected to Stitch');
    }).catch(err => {
        console.error(err);
    });
  }
}
