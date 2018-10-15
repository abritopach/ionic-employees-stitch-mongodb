import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StitchMongoServiceService } from '../services/stitch-mongo-service.service';

import { AnonymousCredential} from 'mongodb-stitch-browser-sdk';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  employee: any = null;

  constructor(private route: ActivatedRoute, private stichMongoService: StitchMongoServiceService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    // console.log('ionViewWillEnter');
    const empployeeId = this.route.snapshot.paramMap.get('id');
    // console.log('employeeId', empployeeId);
    this.findEmployee(empployeeId);
  }

  findEmployee(employeId) {
    this.stichMongoService.client.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log('user', user);
      return this.stichMongoService.find('employees', {'employee_name': employeId});
      }
    ).then(docs => {
        // Collection is empty.
        if (docs.length !== 0) {
          // console.log(docs);
          this.employee = docs[0];
        }
    }).catch(err => {
        console.error(err);
    });
  }


}
