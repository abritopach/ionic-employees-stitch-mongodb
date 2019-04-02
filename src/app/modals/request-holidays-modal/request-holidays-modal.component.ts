import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import config from '../../config/config';
import { StitchMongoService } from '../../services/stitch-mongo.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-request-holidays-modal',
  templateUrl: './request-holidays-modal.component.html',
  styleUrls: ['./request-holidays-modal.component.scss'],
})
export class RequestHolidaysModalComponent implements OnInit {

  requestHolidaysForm: FormGroup;
  employees: any;

  constructor(private formBuilder: FormBuilder, private stitchMongoService: StitchMongoService, private modalCtrl: ModalController) {
    this.createForm();
  }

  ngOnInit() {
    this.fetchEmployees();
  }

  createForm() {
    this.requestHolidaysForm = this.formBuilder.group({
      whoFor: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      reason: new FormControl('', Validators.required)
    });
  }

  requestHolidaysFormSubmit() {
  }

  fetchEmployees() {
    this.stitchMongoService.find(config.COLLECTION_KEY, {})
    .then(docs => {
      this.employees = docs;
      console.log('employees', this.employees);
    });
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss(this.requestHolidaysForm.value);
  }

}
