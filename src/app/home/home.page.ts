import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { StitchMongoService, AuthenticationService } from './../services';

import config from '../config/config';
import { LoaderService } from '../services/loader.service';
import { CardItem } from 'st-three-dimensional-card-carousel/dist/types/models/cardItem.model';

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
  slides: CardItem[] = [];

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
          console.log('employees', this.employees);
          this.builtCarouselSlides();
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

  builtCarouselSlides() {
    console.log('HomePage::builtCarouselSlides() | method called');
    this.employees.map((employee, index) => {
      const cardItem: CardItem = {
        id: index,
        title: employee.employee_name,
        imgUrl: employee.avatar,
        color: '#1abc9c',
        currentPlacement: 0
      };
      this.slides.push(cardItem);
    });
    console.log('slides', this.slides);
  }

}
