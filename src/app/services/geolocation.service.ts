import { Injectable, NgZone } from '@angular/core';

import { MapsAPILoader } from '@agm/core';
import { Subject } from 'rxjs';
import { LoaderService } from './loader.service';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  loading: any;
  placeSubject: Subject<Object> = new Subject<Object>() ;

  constructor(private loaderService: LoaderService, private ngZone: NgZone, private mapsApiLoader: MapsAPILoader) { }

  locate() {
    console.log('GeolocationService::locate() | method called');
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async getAddress() {
    console.log('GeolocationService::getAddress() | method called');
    this.loaderService.present('Please wait, geolocating...');
    const position = await this.locate();
    const lat = position['coords'].latitude;
    const lng = position['coords'].longitude;
    if (navigator.geolocation) {
      return await this.geocode(lat, lng);
    }
  }

  async geocode(lat, lng) {
    console.log('GeolocationService::geocode(lat, lng) | method called');
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
    const request = { latLng: latlng };
    return new Promise((resolve, reject) => {
      geocoder.geocode(request, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const result = results[0];
          if (result != null) {
            console.log(result.formatted_address);
            resolve({address: result.formatted_address, lat: lat, lng: lng});
          } else {
            alert('No address available!');
            reject('No address available!');
          }
          this.loaderService.dismiss();
        } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          console.log('Bad destination address.');
          reject('Bad destination address.');
          this.loaderService.dismiss();
      } else {
          console.log('Error calling Google Geocode API.');
          reject('Error calling Google Geocode API.');
          this.loaderService.dismiss();
      }
      });
    });
  }

  findAdress(elementRef) {
    this.mapsApiLoader.load().then(() => {
      const inputElement = elementRef.nativeElement;
      const autocomplete = new google.maps.places.Autocomplete(inputElement);
      autocomplete.addListener('place_changed', () => {
        console.log('place_changed');
        this.ngZone.run(() => {
          const place = google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log('place', place);
          this.placeSubject.next({address: place.formatted_address, lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()});
        });
      });
    });
   }
}
