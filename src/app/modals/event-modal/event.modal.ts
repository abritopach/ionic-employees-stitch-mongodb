import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StitchMongoService } from './../../services/stitch-mongo.service';
import config from '../../config/config';
import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';


@Component({
  selector: 'app-event-modal',
  templateUrl: 'event.modal.html',
  styleUrls: ['./event.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventModalComponent implements OnInit {

  eventForm: FormGroup;
  currentYear = new Date().getFullYear();
  currentDate =  new Date();
  employees: any;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private stitchMongoService: StitchMongoService,
              private storage: Storage) {
    this.createForm();
  }

  ngOnInit() {
    this.fetchEmployees();
  }

  createForm() {
    this.eventForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      fromTime: new FormControl('', Validators.required),
      untilTime: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      participants: new FormControl('', Validators.required),
    });
  }

  eventFormSubmit() {
    console.log('EventModalComponent::eventFormSubmit | method called');
    console.log(this.eventForm.value);
    this.eventForm.value.time = this.eventForm.value.fromTime + ' - ' + this.eventForm.value.untilTime;

    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        console.log('objectId', objectId);
        this.stitchMongoService.updateOne(config.COLLECTION_KEY, objectId, this.eventForm.value).then(result => {
          console.log('result', result);
        });
      }
    });

  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  fetchEmployees() {
    this.stitchMongoService.find(config.COLLECTION_KEY, {})
    .then(docs => {
      this.employees = docs;
    });
  }

}
