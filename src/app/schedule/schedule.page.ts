import { Component, OnInit } from '@angular/core';

import { PopoverController } from '@ionic/angular';

import { ShowPeoplePopoverComponent } from './../popovers/show-people.popover';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  currentYear = new Date().getFullYear();
  people: any = [
    {avatar: 'http://i.pravatar.cc/150?img=7'},
    {avatar: 'http://i.pravatar.cc/150?img=8'},
    {avatar: 'http://i.pravatar.cc/150?img=9'},
    {avatar: 'http://i.pravatar.cc/150?img=10'}
  ];

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

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {
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

}
