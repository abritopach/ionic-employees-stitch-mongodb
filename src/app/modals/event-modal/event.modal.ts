import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

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

employees = [
  {name: 'Adrián Brito Pacheco', avatar: 'http://i.pravatar.cc/150?img=7'},
  {name: 'José Antonio Pérez Florencia', avatar: 'http://i.pravatar.cc/150?img=2'},
  {name: 'Ana Ruiz Pérez', avatar: 'http://i.pravatar.cc/150?img=9'}
];

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
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
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }
}
