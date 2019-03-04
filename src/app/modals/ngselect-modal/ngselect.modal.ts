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
    {_id: 1, name: 'Work', icon: 'assets/images/work.png'},
    {_id: 2, name: 'Personal', icon: 'assets/images/personal.png'},
    {_id: 3, name: 'Inspiration', icon: 'assets/images/inspiration.png'},
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
        const tagsIds = [];
        for (let i = 0; i < this.tags.length; i++) {
          for (let j = 0; j < tags.length; j++) {
            if (this.tags[i].name === tags[j]) {
              tagsIds.push(this.tags[i]._id);
            }
          }
        }
        this.ngselectForm.patchValue({newData: tagsIds});
      }
    }
    if (action === 'collaborator') {
      this.items = [];
      this.fetchEmployees();
      let collaborators = this.navParams.data.modalProps.note.collaborators;
      if ((typeof collaborators !== 'undefined') && (collaborators.length !== 0)) {
        collaborators = collaborators.map(collaborator => collaborator.toString());
        this.ngselectForm.patchValue({newData: collaborators});
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
    let value = this.ngselectForm.value;
    if (this.navParams.data.modalProps.action === 'tag') {
      const tagsNames = [];
        for (let i = 0; i < this.tags.length; i++) {
          for (let j = 0; j < this.ngselectForm.value.newData.length; j++) {
            if (this.tags[i]._id === this.ngselectForm.value.newData[j]) {
              tagsNames.push(this.tags[i].name);
            }
          }
        }
      value = {newData: tagsNames};
    }
    this.modalCtrl.dismiss({option: this.navParams.data.modalProps.action, ...value});
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
        const item = {name: doc['employee_name'], icon: doc['avatar'], _id: doc['user_id'].toString()};
        return item;
      });
    }).catch(err => {
        console.error(err);
    });
  }

}
