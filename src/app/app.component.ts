import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router, RoutesRecognized } from '@angular/router';

import { AuthenticationService, IziToastService } from './services/';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  public appPages = [
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
    },
    {
      title: 'Schedule',
      url: '/schedule',
      icon: 'calendar'
    },
    {
      title: 'To Do',
      url: '/todo',
      icon: 'list-box'
    },
    {
      title: 'Notes',
      url: '/notes-list',
      icon: 'list-box'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private authenticationService: AuthenticationService,
    private iziToast: IziToastService
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

      /*
      this.authenticationService.authenticationState.subscribe(state => {
        console.log(state);
        if (state) {
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['login']);
        }
      });
      */
    });
  }

  navigateByURL(url) {
    this.router.navigateByUrl(url);
  }
}
