import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.scss'],
})
export class FrequencyComponent implements OnInit {

  options = {
    enabled: true,
    repeat: 'daily',
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
  toggle = true;

  constructor(private popoverCtrl: PopoverController) {
    this.dateText = this.frequencyMap.daily;
  }

  ngOnInit() {}

  onSelectChange(selected) {
    console.log('FrequencyComponent::onSelectChange(selectedValue) | method called', selected.detail.value);
    this.dateText = this.frequencyMap[selected.detail.value];
    console.log('dateText', this.dateText);
    if ((this.dateText === 'day') || (this.dateText === 'year')) {
      if (typeof this.options['days'] !== 'undefined') {
        delete this.options['days'];
      }
      if (typeof this.options['condition'] !== 'undefined') {
        delete this.options['condition'];
      }
    }
  }

  selectedWeekday(event) {
    console.log('FrequencyComponent::selectedWeekday(event) | method called', event);
    this.options['days'] = event;
  }

  onClickAccept() {
    console.log('FrequencyComponent::onClickAccept() | method called', this.options);
    this.popoverCtrl.dismiss(this.options);
  }

  ionChangeCondition1(event) {
    console.log('FrequencyComponent::ionChangeCondition1(event) | method called', event);
    console.log('condition1', event.detail.checked);
    if (event.detail.checked) {
      this.options['condition'] = 'sameDay';
    }
  }

  ionChangeCondition2(event) {
    console.log('FrequencyComponent::ionChangeCondition2(event) | method called', event);
    console.log('condition2', event.detail.checked);
    if (event.detail.checked) {
      this.options['condition'] = 'thirdTuesday';
    }
  }

}
