import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

}
