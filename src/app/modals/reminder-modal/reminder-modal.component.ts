import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reminder-modal',
  templateUrl: './reminder-modal.component.html',
  styleUrls: ['./reminder-modal.component.scss'],
})
export class ReminderModalComponent implements OnInit {

  modalTitle: '';
  reminderForm: FormGroup;

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.modalTitle = this.navParams.data.modalProps.title;
  }

  createForm() {
    this.reminderForm = this.formBuilder.group({
      hourCheckbox: new FormControl('', Validators.required),
      locationCheckbox: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      hour: new FormControl('', Validators.required),
      frequency: new FormControl('', Validators.required),
    });
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  reminderFormSubmit() {
    console.log('ReminderModalComponent::reminderFormSubmit | method called', this.reminderForm.value);
  }

}
