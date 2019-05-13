import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import config from '../../config/config';
import { ObjectId } from 'bson';
import { Storage } from '@ionic/storage';
import { StitchMongoService } from '../../services/stitch-mongo.service';

@Component({
  selector: 'app-user-profile-modal',
  templateUrl: './user-profile-modal.component.html',
  styleUrls: ['./user-profile-modal.component.scss'],
})
export class UserProfileModalComponent implements OnInit {

  departments = [
    {name: 'Technical', icon: 'assets/images/technical-icon.png'},
    {name: 'Marketing', icon: 'assets/images/marketing-icon.png'},
  ];

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private storage: Storage,
              private stitchMongoService: StitchMongoService) {
    this.createForm();
  }

  userProfileForm: FormGroup;
  avatar = null;

  ngOnInit() {
    this.getUserDetails();
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  createForm() {
    this.userProfileForm = this.formBuilder.group({
      employee_name: new FormControl('', Validators.required),
      job_position: new FormControl('', Validators.required),
      description: new FormControl(''),
      phone: new FormControl(''),
      department: new FormControl('', Validators.required),
    });
  }

  userProfileFormSubmit() {
    console.log('UserProfileModalComponent::userProfileFormSubmit | method called');
    this.updateUserProfile();
  }

  getUserDetails() {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: objectId}).then(result => {
          console.log(result);
          this.userProfileForm.patchValue(result[0]);
          this.avatar = result[0]['avatar'];
          console.log(this.userProfileForm.value);
        });
      }
    });
  }

  updateUserProfile() {
    this.storage.get(config.TOKEN_KEY).then(res => {
      if (res) {
        const objectId = new ObjectId(res);
        console.log('objectId', objectId);
        this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId},
        { $set: this.userProfileForm.value }).then(result => {
          console.log('result', result);
        });
      }
    });
  }

}
