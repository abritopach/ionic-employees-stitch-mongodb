import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-tags-modal',
  templateUrl: 'tags.modal.html',
  styleUrls: ['./tags.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagsModalComponent implements OnInit {

  tagsForm: FormGroup;

  tags = [
    {name: 'Work', icon: 'assets/images/work.png'},
    {name: 'Personal', icon: 'assets/images/personal.png'},
    {name: 'Inspiration', icon: 'assets/images/inspiration.png'},
  ];

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.tagsForm = this.formBuilder.group({
      newTags: new FormControl('', Validators.required),
    });
  }

  tagsFormSubmit() {
    console.log('TagsModalComponent::tagsFormSubmit | method called', this.tagsForm.value);
    this.modalCtrl.dismiss(this.tagsForm.value);
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss(this.tagsForm.value);
  }

}
