import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { StitchMongoService } from '../../services/stitch-mongo.service';

import config from '../../config/config';


@Component({
  selector: 'app-ngselect-modal',
  templateUrl: 'ngselect.modal.html',
  styleUrls: ['./ngselect.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgSelectModalComponent implements OnInit {

  ngselectForm: FormGroup;

  items = [];

  tags = [
    {name: 'Work', icon: 'assets/images/work.png'},
    {name: 'Personal', icon: 'assets/images/personal.png'},
    {name: 'Inspiration', icon: 'assets/images/inspiration.png'},
  ];

  modalTitle = '';

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private navParams: NavParams,
              private stitchMongoService: StitchMongoService) {
    this.createForm();
  }

  ngOnInit() {
    const action = this.navParams.data.modalProps.action;
    this.modalTitle = this.navParams.data.modalProps.title;
    if (action === 'tag') {
      this.items = this.tags;
      const tags = this.navParams.data.modalProps.note.tags;
      if ((typeof tags !== 'undefined') && (tags.length !== 0)) {
        this.ngselectForm.patchValue({newData: tags});
      }
    }
    if (action === 'collaborator') {
      this.items = [];
      this.fetchEmployees();
      const collaborators = this.navParams.data.modalProps.note.collaborators;
      if ((typeof collaborators !== 'undefined') && (collaborators.length !== 0)) {
        // this.ngselectForm.patchValue({newData: tags});
      }
    }
  }

  createForm() {
    this.ngselectForm = this.formBuilder.group({
      newData: new FormControl('', Validators.required),
    });
  }

  ngselectFormSubmit() {
    console.log('NgSelectModalComponent::ngselectFormSubmit | method called', this.ngselectForm.value);
    this.modalCtrl.dismiss({option: this.navParams.data.modalProps.action, ...this.ngselectForm.value});
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  fetchEmployees() {
    this.stitchMongoService.find(config.COLLECTION_KEY, {}).then(docs => {
      this.items = docs.map(doc => {
        const item = {name: doc['employee_name'], icon: doc['avatar']};
        return item;
      });
    }).catch(err => {
        console.error(err);
    });
  }

}
