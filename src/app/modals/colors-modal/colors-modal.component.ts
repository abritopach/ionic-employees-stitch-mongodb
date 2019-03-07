import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-colors-modal',
  templateUrl: './colors-modal.component.html',
  styleUrls: ['./colors-modal.component.scss'],
})
export class ColorsModalComponent implements OnInit {

  modalTitle = '';
  backgroundColor = '#fff';
  result = {color: '#fff', property: 'background', option: 'colour'};

  constructor(private modalCtrl: ModalController, private navParams: NavParams) { }

  ngOnInit() {
    this.modalTitle = this.navParams.data.modalProps.title;
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  setColor(property, event) {
    console.log(property, event);
    this.result.property = property;
    this.result.color = event;
  }

  accept() {
    this.modalCtrl.dismiss(this.result);
  }

}
