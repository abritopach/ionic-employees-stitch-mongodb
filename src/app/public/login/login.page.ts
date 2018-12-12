import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { StitchMongoService } from './../../services/stitch-mongo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private stichMongoService: StitchMongoService) {
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
    console.log(this.loginForm.value);
    // this.stichMongoService.login({email: '', password: ''});
  }

}
