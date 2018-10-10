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
  employees = [
    {employee_name: 'Adrián Brito Pacheco', job_position: 'Project Manager', avatar: 'http://i.pravatar.cc/150?img=1',
     description: 'Description'},
    {employee_name: 'José Antonio Pérez Florencia', job_position: 'Software Developer', avatar: 'http://i.pravatar.cc/150?img=2',
    description: 'Description'}
  ];

  constructor(private router: Router, private stichMongoService: StitchMongoServiceService) {
    console.log('HomePage::constructor() | method called');
    console.log('employees', this.employees);

    /*
    const client = Stitch.initializeDefaultAppClient('ionic-employees-priuv');

    const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('mongo-employees');

      client.auth.loginWithCredential(new AnonymousCredential()).then(user =>
      // db.collection('employees').updateOne({owner_id: client.auth.user.id}, {$set: { number: 42 }}, { upsert: true})
      db.collection('employees').find({}, { limit: 100}).asArray()
    ).then(() =>
      db.collection('employees').find({owner_id: client.auth.user.id}, { limit: 100}).asArray()
    ).then(docs => {
        // Collection is empty.
        if (docs.length === 0) {
          db.collection('employees').insertMany(this.employees).then(results => {
            const { insertedIds } = results;
            console.log(insertedIds);
          }).catch(err => {
          console.error(err);
        });
        } else {
          console.log('Found docs', docs);
          // db.collection('employees').deleteOne({employee_name: 'Adrián Brito Pacheco'}).then(result => {
          // console.log(result);
          });
        }
        console.log('[MongoDB Stitch] Connected to Stitch');
    }).catch(err => {
        console.error(err);
    });
    */

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
          // stichMongoService.insertMany('employees', this.employees);
        } else {
          console.log('Found docs', docs);
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
