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
  autoloop = {
    enabled: false,
    seconds: 2000
  };
  slidesColors = ['#1abc9c', '#e67e22', '#e74c3c', '#2c3e50', '#2980b9', '#9b59b6'];
  slideDistance = 200;

  constructor(private router: Router, private stichMongoService: StitchMongoService,
              private authenticationService: AuthenticationService,
              /*private loaderService: LoaderService*/) {
    console.log('HomePage::constructor() | method called');

    this.fetchEmployees();
    this.fetchEmployeesGroupByFirstLetter();

    this.searchControl = new FormControl();

    /*
    this.slides = [
      {id: 0, title: 'Adrián Brito Pacheco',
      imgUrl: '',
       color: '#1abc9c', currentPlacement: 0},
      {id: 1, title: 'José Antonio Pérez Florencia', imgUrl: 'http://i.pravatar.cc/150?img=2', color: '#1abc9c', currentPlacement: 0},
      {id: 2, title: 'Patricia Acosta García', imgUrl: 'http://i.pravatar.cc/150?img=5', color: '#1abc9c', currentPlacement: 0},
      {id: 3, title: 'Ana Ruiz Pérez', imgUrl: 'http://i.pravatar.cc/150?img=9', color: '#1abc9c', currentPlacement: 0},
      {id: 4, title: 'Juan Olmos Gil', imgUrl: 'http://i.pravatar.cc/150?img=4', color: '#1abc9c', currentPlacement: 0},
      {id: 5, title: 'Test', imgUrl: '', color: '#1abc9c', currentPlacement: 0}
    ];
    */

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
        color: this.slidesColors[index],
        currentPlacement: 0,
        description: employee.description,
        subtitle: {
          text: employee.job_position,
          icon: 'fa fa-info-circle'
        },
        footer: {
          icons: {
              leftIcon: 'fa fa-tasks',
              rightIcon: ''
          },
          values: {
              leftValue: employee.projects ? employee.projects.length : 0,
              rightValue: null
          }
        }
      };
      this.slides.push(cardItem);
    });
    console.log('slides', this.slides);
  }

  handleSelectedItem(event) {
    console.log('HomePage::handleSelectedItem() | method called');
    const selectedItem = event.detail;
    console.log('Received event from component: ', selectedItem);
    setTimeout(() => {
      this.router.navigateByUrl(`/detail/${selectedItem.title}`);
    }, 2000);
  }

  handleSlideChange(event) {
    console.log('HomePage::handleSlideChange() | method called', event.detail);
  }

}
