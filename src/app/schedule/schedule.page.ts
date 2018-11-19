import { Component, OnInit, HostListener } from '@angular/core';

import { PopoverController } from '@ionic/angular';

import { ShowPeoplePopoverComponent } from './../popovers/show-people.popover';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss']
})
export class SchedulePage implements OnInit {

  currentYear = new Date().getFullYear();
  people: any;

  peopleMore: any = [
    {avatar: 'http://i.pravatar.cc/150?img=7'},
    {avatar: 'http://i.pravatar.cc/150?img=8'},
    {avatar: 'http://i.pravatar.cc/150?img=9'},
    {avatar: 'http://i.pravatar.cc/150?img=10'},
    {avatar: 'http://i.pravatar.cc/150?img=11'},
    {avatar: 'http://i.pravatar.cc/150?img=12'},
    {avatar: 'http://i.pravatar.cc/150?img=13'},
    {avatar: 'http://i.pravatar.cc/150?img=14'},
    {avatar: 'http://i.pravatar.cc/150?img=15'},
    {avatar: 'http://i.pravatar.cc/150?img=16'},
    {avatar: 'http://i.pravatar.cc/150?img=17'},
    {avatar: 'http://i.pravatar.cc/150?img=18'},
    {avatar: 'http://i.pravatar.cc/150?img=19'},
    {avatar: 'http://i.pravatar.cc/150?img=20'}
  ];

  // https://www.code-sample.com/2018/07/angular-6-google-maps-agm-core.html
  lat = 26.765844;
  lng = 83.364944;
  innerWidth: any;
  countPeople = 3;
  avatarColSize = 2;
  chipColSize = 2;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(event.target.innerWidth);
    this.checkWidth(event.target.innerWidth);
    this.people = this.peopleMore.slice(0, this.countPeople);
  }

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    console.log('innerWidth', this.innerWidth);
    this.checkWidth(this.innerWidth);
    this.people = this.peopleMore.slice(0, this.countPeople);
  }

  onClickShowPeople() {
    console.log('SchedulePage::onClickShowPeople | method called');
    this.presentPopover();
  }

  async presentPopover() {
    const componentProps = { popoverProps: { people: this.peopleMore}};
    const popover = await this.popoverCtrl.create({
      component: ShowPeoplePopoverComponent,
      componentProps: componentProps
      // event: event
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
      this.popoverCtrl.dismiss();
    }

  }

  checkWidth(width) {

    // Extra small
    if (width <= 400) {
      this.countPeople = 2;
      this.avatarColSize = 2;
      this.chipColSize = 2;
    }
    // Small
    if ((width >= 401) && (width <= 640)) {
      this.countPeople = 3;
      this.avatarColSize = 2;
      this.chipColSize = 2;
    }
    // Medium 641px to 1007px
    if ((width >= 641) && (width <= 1007)) {
      this.countPeople = 6;
      this.avatarColSize = 1;
      this.chipColSize = 6;
    }
    // Large
    console.log('avatarColSize', this.avatarColSize);
    console.log('chipColSize', this.chipColSize);
  }

}
