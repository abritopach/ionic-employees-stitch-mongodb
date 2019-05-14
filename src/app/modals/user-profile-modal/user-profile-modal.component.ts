import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import config from '../../config/config';
import { ObjectId } from 'bson';
import { Storage } from '@ionic/storage';
import { StitchMongoService } from '../../services/stitch-mongo.service';
import { Ng2ImgMaxService } from 'ng2-img-max';

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
              private stitchMongoService: StitchMongoService, private ng2ImgMax: Ng2ImgMaxService) {
    this.createForm();
  }

  userProfileForm: FormGroup;
  avatar = null;
  showProjects = false;

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
      avatar: new FormControl(''),
      projects: new FormControl('')
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

  editAvatar() {
    const element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
    element.click();
  }

  handleInputChange(event) {
    console.log('UserDetailsPage::handleInputChange() | method called', event);
    const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    console.log('size', file.size);
    console.log('type', file.type);

    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      console.log('Invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);


    if (file.size >= 300000) {
      this.ng2ImgMax.compressImage(file, 0.300).subscribe(
        result => {
          console.log('image compress', result);
          reader.readAsDataURL(result);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      reader.readAsDataURL(file);
    }
  }

  _handleReaderLoaded(e) {
    const reader = e.target;
    console.log(reader.result);

    this.avatar = reader.result;
    this.storage.set(config.AVATAR_KEY, this.avatar);
    this.storage.set(config.EMPLOYEE_KEY, this.userProfileForm.value.employee_name);
    this.userProfileForm.patchValue({
      avatar: reader.result,
    });
  }

}
