import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { StitchMongoService, AuthenticationService } from './../services';

import config from '../config/config';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  employees: any;
  searchControl: FormControl;
  loading: any;
  result: any;

  constructor(private router: Router, private stichMongoService: StitchMongoService,
              private authenticationService: AuthenticationService,
              /*private loaderService: LoaderService*/) {
    console.log('HomePage::constructor() | method called');

    this.fetchEmployees();
    this.fetchEmployeesGroupByFirstLetter();

    this.searchControl = new FormControl();

  }

  ngOnInit() {
    console.log('HomePage::ngOnInit | method called');
  }

  ionViewWillEnter() {
    console.log('HomePage::ionViewWillEnter | method called');
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      if (search === '') {
        this.fetchEmployees();
        this.fetchEmployeesGroupByFirstLetter();
      } else {
        this.stichMongoService.login(null).then(user => {
            const args = [];
            args.push(search);
            this.stichMongoService.client.callFunction('search', args)
            .then(employees => {
              console.log('employees', employees);
              const item = [];
              item.push({'employees': employees});
              this.result = item;
              console.log('this.result.employees', this.result);
              this.employees = employees;
            })
              .catch(e => console.log('error: ', e));
        }
        );
      }
    });

  }

  viewEmployeeDetails(employee) {
    console.log('HomePage::viewEmployeeDetails() | method called');
    this.router.navigateByUrl('/detail');
  }

  searchEmployees(ev: any) {
    console.log('HomePage::searchEmployees() | method called', ev.target.value);
  }

  cancelSearch(ev: any) {
    console.log('HomePage::cancelSearch() | method called');
  }

  fetchEmployees() {
    // this.loaderService.present('Please wait, loading employees...');
    this.stichMongoService.login(null).then(user => {
      return this.stichMongoService.find(config.COLLECTION_KEY, {});
    })/*.then(() =>
      db.collection(config.COLLECTION_KEY).find({owner_id: client.auth.user.id}, { limit: 100}).asArray()
    )*/.then(docs => {
        // Collection is empty.
        if (docs.length === 0) {
          this.stichMongoService.populateFakeEmployees();
        } else {
          this.employees = docs;
          // setTimeout(() => this.loaderService.dismiss(), 2000);
        }
        console.log('[MongoDB Stitch] Connected to Stitch');
    }).catch(err => {
        console.error(err);
    });
  }

  fetchEmployeesGroupByFirstLetter() {
    this.stichMongoService.login(null).then(user =>
      this.stichMongoService.aggregate(config.COLLECTION_KEY, '$employee_name')
    ).then(docs => {
        // Collection is empty.
        if (docs.length === 0) {
          console.log('Collection is empty');
        } else {
          console.log(docs);
          this.result = docs;
        }
        console.log('[MongoDB Stitch] Connected to Stitch');
    }).catch(err => {
        console.error(err);
    });
  }

  logout() {
    console.log('HomePage::logout() | method called');
    this.authenticationService.logout();
  }

}
