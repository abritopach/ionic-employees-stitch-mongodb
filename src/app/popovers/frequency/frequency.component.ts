import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.scss'],
})
export class FrequencyComponent implements OnInit {

  options = {
    enabled: true,
    frequency: 'daily',
    count: 1,
    when: 'always'
  };

  frequencyMap = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
    annually: 'year'
  };

  dateText;

  constructor() {
    this.dateText = this.frequencyMap.daily;
  }

  ngOnInit() {}

  onSelectChange(selected) {
    console.log('FrequencyComponent::onSelectChange(selectedValue) | method called', selected.detail.value);
    this.dateText = this.frequencyMap[selected.detail.value];
    console.log('dateText', this.dateText);
  }

}
