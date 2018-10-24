import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-show-people-popover',
  templateUrl: 'show-people.popover.html',
  styleUrls: ['./show-people.popover.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShowPeoplePopoverComponent implements OnInit {

  people: [
    {avatar: 'http://i.pravatar.cc/150?img=7'},
    {avatar: 'http://i.pravatar.cc/150?img=7'},
    {avatar: 'http://i.pravatar.cc/150?img=7'},
    {avatar: 'http://i.pravatar.cc/150?img=7'},
    {avatar: 'http://i.pravatar.cc/150?img=7'},
    {avatar: 'http://i.pravatar.cc/150?img=7'}
  ];

  constructor(private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
  }

}
