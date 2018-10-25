import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-show-people-popover',
  templateUrl: 'show-people.popover.html',
  styleUrls: ['./show-people.popover.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShowPeoplePopoverComponent implements OnInit {

  people: any = [
    {avatar: 'http://i.pravatar.cc/150?img=7'},
    {avatar: 'http://i.pravatar.cc/150?img=8'},
    {avatar: 'http://i.pravatar.cc/150?img=9'},
    {avatar: 'http://i.pravatar.cc/150?img=10'},
    {avatar: 'http://i.pravatar.cc/150?img=11'},
    {avatar: 'http://i.pravatar.cc/150?img=12'}
  ];

  constructor(private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
  }

}
