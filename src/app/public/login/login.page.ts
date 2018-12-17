import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { StitchMongoService, AuthenticationService } from './../../services';

import { ObjectId } from 'bson';

import { Router } from '@angular/router';

import config from '../../config/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  avatar = null;

  constructor(private formBuilder: FormBuilder, private stitchMongoService: StitchMongoService,
              private authService: AuthenticationService, private router: Router) {
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
    this.stitchMongoService.login(this.loginForm.value).then(authedId => {
      // console.log(authedId);
      // console.log(`successfully logged in with id: ${authedId.id}`);
      this.authService.login(authedId.id).then(result => {
        this.stitchMongoService.find(config.COLLECTION_KEY, {user_id: new ObjectId(authedId.id)}).then(employee => {
          // console.log(employee);
          this.avatar = employee[0]['avatar'];
          setTimeout(() => this.router.navigateByUrl('/home'), 2000);
        });
      });
    })
    .catch(err => console.error(`login failed with error: ${err}`));
  }

}
