import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.scss']
})
export class OrganizationChartComponent implements OnInit {

  organization: any = {
    'employee_name': '',
    'employee_position': 'Director',
    'employee_avatar': 'http://i.pravatar.cc/150?img=7',
    'children': [
      { 'employee_name': '', 'employee_position': 'Assistante Director', 'employee_avatar': 'http://i.pravatar.cc/150?img=1' },
      { 'employee_name': '', 'employee_position': 'Administration', 'employee_avatar': 'http://i.pravatar.cc/150?img=2'}
    ],
    'departments': [
      {'name': 'Marketing', 'avatar': 'assets/images/marketing-icon.png', 'class': 'dep-a', 'children': [
        { 'employee_name': '', 'employee_position': 'Marketing 1', 'employee_avatar': 'http://i.pravatar.cc/150?img=3' },
        { 'employee_name': '', 'employee_position': 'Marketing 2', 'employee_avatar': 'http://i.pravatar.cc/150?img=4' },
        { 'employee_name': '', 'employee_position': 'Marketing 3', 'employee_avatar': 'http://i.pravatar.cc/150?img=5' },
        { 'employee_name': '', 'employee_position': 'Marketing 4', 'employee_avatar': 'http://i.pravatar.cc/150?img=8' },
        { 'employee_name': '', 'employee_position': 'Marketing 5', 'employee_avatar': 'http://i.pravatar.cc/150?img=9' }
      ]},
      {'name': 'Technical', 'avatar': 'assets/images/technical-icon.png', 'class': 'dep-b', 'children': [
        { 'employee_name': '', 'employee_position': 'Technical 1', 'employee_avatar': 'http://i.pravatar.cc/150?img=10' },
        { 'employee_name': '', 'employee_position': 'Technical 2', 'employee_avatar': 'http://i.pravatar.cc/150?img=11' },
        { 'employee_name': '', 'employee_position': 'Technical 3', 'employee_avatar': 'http://i.pravatar.cc/150?img=12' },
        { 'employee_name': '', 'employee_position': 'Technical 4', 'employee_avatar': 'http://i.pravatar.cc/150?img=13' }
      ]},
      {'name': 'QA', 'avatar': 'assets/images/qa-icon.png', 'class': 'dep-c', 'children': [
        { 'employee_name': '', 'employee_position': 'QA 1', 'employee_avatar': 'http://i.pravatar.cc/150?img=14' },
        { 'employee_name': '', 'employee_position': 'QA 2', 'employee_avatar': 'http://i.pravatar.cc/150?img=15' },
        { 'employee_name': '', 'employee_position': 'QA 3', 'employee_avatar': 'http://i.pravatar.cc/150?img=16' },
        { 'employee_name': '', 'employee_position': 'QA 4', 'employee_avatar': 'http://i.pravatar.cc/150?img=17' }
      ]},
      {'name': 'Sales', 'avatar': 'assets/images/sales-icon.png', 'class': 'dep-d', 'children': [
        { 'employee_name': '', 'employee_position': 'Sales 1', 'employee_avatar': 'http://i.pravatar.cc/150?img=18' },
        { 'employee_name': '', 'employee_position': 'Sales 2', 'employee_avatar': 'http://i.pravatar.cc/150?img=19' },
        { 'employee_name': '', 'employee_position': 'Sales 3', 'employee_avatar': 'http://i.pravatar.cc/150?img=20' },
        { 'employee_name': '', 'employee_position': 'Sales 4', 'employee_avatar': 'http://i.pravatar.cc/150?img=21' },
        { 'employee_name': '', 'employee_position': 'Sales 5', 'employee_avatar': 'http://i.pravatar.cc/150?img=22' },
        { 'employee_name': '', 'employee_position': 'Sales 6', 'employee_avatar': 'http://i.pravatar.cc/150?img=23' }
      ]},
      {'name': 'Finance', 'avatar': 'assets/images/finance-icon.png', 'class': 'dep-e', 'children': [
        { 'employee_name': '', 'employee_position': 'Finance 1', 'employee_avatar': 'http://i.pravatar.cc/150?img=24' },
        { 'employee_name': '', 'employee_position': 'Finance 2', 'employee_avatar': 'http://i.pravatar.cc/150?img=25' },
        { 'employee_name': '', 'employee_position': 'Finance 3', 'employee_avatar': 'http://i.pravatar.cc/150?img=26' }
      ]}
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
