import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit } from '@angular/core';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { StitchMongoService, IziToastService } from './../../services';
import config from '../../config/config';
import { Storage } from '@ionic/storage';
import { ObjectId } from 'bson';

import * as moment from 'moment';

import { MapsAPILoader } from '@agm/core';

declare const google: any;

@Component({
  selector: 'app-event-modal',
  templateUrl: 'event.modal.html',
  styleUrls: ['./event.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventModalComponent implements OnInit, AfterViewInit {

  eventForm: FormGroup;
  currentYear = new Date().getFullYear();
  currentDate =  new Date();
  employees: any;
  loading: any;
  // @ViewChild('address', { read: ElementRef }) addressElementRef: ElementRef;
  @ViewChild('address') addressElementRef: ElementRef;

  constructor(private modalCtrl: ModalController, private formBuilder: FormBuilder, private stitchMongoService: StitchMongoService,
              private storage: Storage, private iziToast: IziToastService, private loadingCtrl: LoadingController,
              private navParams: NavParams, private mapsApiLoader: MapsAPILoader, private ngZone: NgZone) {
    this.createForm();
  }

  ngOnInit() {
    this.fetchEmployees();
    if (typeof this.navParams.data.modalProps.event !== 'undefined') {
      this.eventForm.patchValue(this.navParams.data.modalProps.event);
    }
  }

  ngAfterViewInit() {
    console.log('EventModalComponent::ngAfterViewInit | method called');
    this.findAdress();
  }

  createForm() {
    this.eventForm = this.formBuilder.group({
      _id: new FormControl(''),
      title: new FormControl('', Validators.required),
      fromTime: new FormControl('', Validators.required),
      untilTime: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      participants: new FormControl('', Validators.required),
      time: new FormControl(''),
      meeting_participants: new FormControl(''),
      address: new FormControl(''),
      lat: new FormControl(''),
      lng: new FormControl('')
    });
  }

  eventFormSubmit() {
    console.log('EventModalComponent::eventFormSubmit | method called');

    this.eventForm.value.time = this.eventForm.value.fromTime + ' - ' + this.eventForm.value.untilTime;

    const meeting_participants = this.eventForm.value.participants.map(participant =>  {
      const p = {avatar: participant};
      return p;
    });

    this.eventForm.value.meeting_participants = meeting_participants;

    const from = moment(this.eventForm.value.fromTime, 'HH:mm p');
    const until = moment(this.eventForm.value.untilTime, 'HH:mm p');

    if (from.isSameOrAfter(until)) {
      this.iziToast.show('Error', 'The start time of the event cannot be the same or later than the end time.',
       'red', 'ico-error', 'assets/avatar.png');
    } else {
      console.log(this.eventForm.value);
      this.storage.get(config.TOKEN_KEY).then(res => {
        if (res) {
          const objectId = new ObjectId(res);
          console.log('objectId', objectId);
          // Update event.
          if (typeof this.navParams.data.modalProps.event !== 'undefined') {
            this.presentLoading('Please wait, updating event...');
            console.log('Update event');
            // this.stitchMongoService.updateEvent(config.COLLECTION_KEY, objectId, this.eventForm.value).then(result => {
            this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId, 'events._id': this.eventForm.value._id},
            { $set: { 'events.$' : this.eventForm.value } }).then(result => {
              console.log('result', result);
              this.dismissLoading();
              this.dismiss();
              this.iziToast.success('Update event', 'Event updated successfully.');
            });
          } else { // Add new event.
            this.presentLoading('Please wait, adding event...');
            // Add id event.
            this.eventForm.value._id = new ObjectId();
            // this.stitchMongoService.updateOne(config.COLLECTION_KEY, objectId, this.eventForm.value).then(result => {
            this.stitchMongoService.update(config.COLLECTION_KEY, {user_id: objectId}, {$push: { events: this.eventForm.value }})
            .then(result => {
              console.log('result', result);
              this.dismissLoading();
              this.dismiss();
              this.iziToast.success('Add event', 'Event added successfully.');
            });
          }
        }
      });
    }
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss(this.eventForm.value);
  }

  fetchEmployees() {
    this.stitchMongoService.find(config.COLLECTION_KEY, {})
    .then(docs => {
      this.employees = docs;
    });
  }

  async presentLoading(message) {
    this.loading = await this.loadingCtrl.create({
      message: message,
    });

    return await this.loading.present();
  }

  async dismissLoading() {
    this.loading.dismiss();
    this.loading = null;
  }

  locate() {
    console.log('EventModalComponent::locate | method called');
    this.presentLoading('Please wait, geolocating...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude; // Works fine
          const lng = position.coords.longitude;  // Works fine
          console.log('Coords', lat, lng);
          this.getAddress(lat, lng);
        },
        error => {
          console.log('Error code: ' + error.code + '<br /> Error message: ' + error.message);
        }
      );
    }
  }

  getAddress(lat: number, lng: number) {
    console.log('EventModalComponent::getAddress | method called');
    if (navigator.geolocation) {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);
      const request = { latLng: latlng };
      geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const result = results[0];
          if (result != null) {
            console.log(result.formatted_address);
            this.eventForm.patchValue({address: result.formatted_address});
            this.eventForm.patchValue({lat: lat});
            this.eventForm.patchValue({lng: lng});
          } else {
            alert('No address available!');
          }
          this.dismissLoading();
        } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          console.log('Bad destination address.');
          this.dismissLoading();
      } else {
          console.log('Error calling Google Geocode API.');
          this.dismissLoading();
      }
      });
    }
  }

  findAdress() {
    this.mapsApiLoader.load().then(() => {

        /*
        console.log(document.getElementById('address'));
        const _inputElement = this.addressElementRef.nativeElement as HTMLInputElement;
        console.log(_inputElement.shadowRoot);
        */

         const inputElement = this.addressElementRef.nativeElement;
         const autocomplete = new google.maps.places.Autocomplete(inputElement);
         autocomplete.addListener('place_changed', () => {
           this.ngZone.run(() => {
             // some details
              const place = google.maps.places.PlaceResult = autocomplete.getPlace();
              console.log('place', place);

             /*
             this.address = place.formatted_address;
             this.web_site = place.website;
             this.name = place.name;
             this.zip_code = place.address_components[place.address_components.length - 1].long_name;
             //set latitude, longitude and zoom
             this.latitude = place.geometry.location.lat();
             this.longitude = place.geometry.location.lng();
             this.zoom = 12;
              */

           });
         });
       });
   }

}
