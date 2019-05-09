import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router, RoutesRecognized } from '@angular/router';

import { AuthenticationService, IziToastService, StitchMongoService } from './services/';
import config from './config/config';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  profilePicture = null;

  public appPages = [
    {groupName: 'General', groupItems: [
      {
        title: 'Home',
        url: '/home',
        icon: 'home'
      },
      {
        title: 'Products',
        url: '/products',
        icon: 'cube'
      },
      {
        title: 'Organization',
        url: '/organization',
        icon: 'people'
      }
    ]
    },
    {groupName: 'Personal', groupItems: [
      {
        title: 'My Schedule',
        url: '/schedule',
        icon: 'calendar'
      }, /*
      {
        title: 'To Do',
        url: '/todo',
        icon: 'list-box'
      },
      */
      {
        title: 'My Notes',
        url: '/notes-list',
        icon: 'list-box'
      },
      {
        title: 'My Holidays',
        url: '/holidays',
        icon: 'airplane'
      }
    ]
  }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private authenticationService: AuthenticationService,
    private iziToast: IziToastService,
    private stichMongoService: StitchMongoService,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.router.events
      .subscribe(event => {
        if (event instanceof RoutesRecognized) {
          if ((!this.authenticationService.isAuthenticated()) && (event.url !== '/home') && (event.url !== '/login')
          && (event.url !== '/') && (event.url !== '/login')) {
            this.iziToast.show('Important NOTE', 'Login to be able to use all the functionality.', 'red', 'ico-error', 'assets/avatar.png');
          }
        }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if ((this.stichMongoService.client === null) && (this.stichMongoService.db === null)) {
        this.stichMongoService.initializeAppClient('ionic-employees-priuv');
        this.stichMongoService.getServiceClient('mongo-employees');
      }

      this.authenticationService.authenticationState.subscribe(state => {
        console.log(state);
        /*
        if (state) {
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['login']);
        }
        */
       if (state) {

          this.storage.get(config.AVATAR_KEY).then(res => {
            console.log(res);
            if (res) {
              this.profilePicture = res;
            }
          });
        }
      });
    });
  }

  navigateByURL(url) {
    this.router.navigateByUrl(url);
  }

  editUserProfile() {
    console.log('editUserProfile');
  }
}
