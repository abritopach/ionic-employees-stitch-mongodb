import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Stitch, RemoteMongoClient, AnonymousCredential} from 'mongodb-stitch-browser-sdk';

import { StitchMongoService} from '../services/stitch-mongo.service';

import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { LoadingController } from '@ionic/angular';

import { NetworkService } from './../services/network.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  currentYear = new Date().getFullYear();
  employees: any;
  searchControl: FormControl;
  loading: any;
  result: any;

  constructor(private router: Router, private stichMongoService: StitchMongoService, private route: ActivatedRoute,
              private loadingCtrl: LoadingController, private networkService: NetworkService) {
    console.log('HomePage::constructor() | method called');
    console.log('employees', this.employees);

    this.stichMongoService.initializeAppCliente('ionic-employees-priuv');
    this.stichMongoService.getServiceClient('mongo-employees');

    this.searchControl = new FormControl();

  }

  ngOnInit() {
    console.log('HomePage::ngOnInit | method called');
    this.fetchEmployees();
    this.fetchEmployeesGroupByFirstLetter();
  }

  ionViewWillEnter() {
    console.log('HomePage::ionViewWillEnter | method called');
    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      if (search === '') {
        console.log('search is empty');
        this.fetchEmployees();
        this.fetchEmployeesGroupByFirstLetter();
      } else {
        console.log('search is not empty');
        this.stichMongoService.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
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
    console.log('HomePage::searchMovies() | method called', ev.target.value);
  }

  cancelSearch(ev: any) {
    console.log('HomePage::cancelSearch() | method called');
  }

  fetchEmployees() {
    this.presentLoading();
    this.stichMongoService.client.auth.loginWithCredential(new AnonymousCredential()).then(user =>
      this.stichMongoService.find('employees', {})
    )/*.then(() =>
      db.collection('employees').find({owner_id: client.auth.user.id}, { limit: 100}).asArray()
    )*/.then(docs => {
        console.log('docs in fetchEmployees', docs);
        // Collection is empty.
        if (docs.length === 0) {
          console.log('Collection is empty');
          // this.stichMongoService.populateFakeEmployees();
        } else {
          console.log('Found docs', docs);
          this.employees = docs;
          setTimeout(() => this.dismissLoading(), 2000);
        }
        console.log('[MongoDB Stitch] Connected to Stitch');
    }).catch(err => {
        console.error(err);
    });
  }

  fetchEmployeesGroupByFirstLetter() {
    this.stichMongoService.client.auth.loginWithCredential(new AnonymousCredential()).then(user =>
      this.stichMongoService.aggregate('employees', '$employee_name')
    ).then(docs => {
      console.log('docs in fetchEmployeesGroupByFirstLetter', docs);
        // Collection is empty.
        if (docs.length === 0) {
          console.log('Collection is empty');
        } else {
          console.log('Found docs', docs);
          this.result = docs;
        }
        console.log('[MongoDB Stitch] Connected to Stitch');
    }).catch(err => {
        console.error(err);
    });
  }

  /*
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait, loading movies...',
    });
    await loading.present();

    const { data } = await loading.onWillDismiss();
  }
  */

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait, loading employees...',
    });

    return await this.loading.present();
  }

  async dismissLoading() {
    this.loading.dismiss();
    this.loading = null;
  }

  showOrganizationChart() {
    console.log('HomePage::showOrganizationChart() | method called');
    this.router.navigateByUrl('/organization');
  }
}
