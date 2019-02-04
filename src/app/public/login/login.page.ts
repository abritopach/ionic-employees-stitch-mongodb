import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { StitchMongoService, AuthenticationService, IziToastService } from './../../services';

import { ObjectId } from 'bson';

import { Router } from '@angular/router';

import config from '../../config/config';

import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  avatar = null;
  loading: any;

  constructor(private formBuilder: FormBuilder, private stitchMongoService: StitchMongoService,
              private authService: AuthenticationService, private router: Router, private iziToast: IziToastService,
              private loadingCtrl: LoadingController) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  loginFormSubmit() {
    console.log('HomePage::loginFormSubmit() | method called');
    // this.stichMongoService.login(this.loginForm.value);
    this.presentLoading();
    this.stitchMongoService.login(this.loginForm.value).then(authedId => {
      // console.log(authedId);
      // console.log(`successfully logged in with id: ${authedId.id}`);
      this.authService.login(authedId.id).then(result => {
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: new ObjectId(authedId.id)}).then(employee => {
          // console.log(employee);
          if ((typeof employee[0]['avatar'] !== 'undefined') && (employee[0]['avatar'] !== null)) {
            this.avatar = employee[0]['avatar'];
          }
          if (this.loading !== null) {
            this.dismissLoading();
          }
          setTimeout(() => this.router.navigateByUrl('/home'), 2000);
        });
      });
    })
    .catch(err => {
      if (this.loading !== null) {
        this.dismissLoading();
      }
      this.iziToast.show('Login', 'You have entered an invalid username or password.', 'red', 'ico-error', 'assets/avatar.png');
      console.error(`login failed with error: ${err}`);
    });
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait, authenticating user...',
    });

    return await this.loading.present();
  }

  async dismissLoading() {
    this.loading.dismiss();
    this.loading = null;
  }

}
