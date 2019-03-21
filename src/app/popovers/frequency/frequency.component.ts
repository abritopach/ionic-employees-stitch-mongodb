import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

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

  constructor(private popoverCtrl: PopoverController, private navParams: NavParams) {
    this.dateText = this.frequencyMap.daily;
  }

  ngOnInit() {
    if (typeof this.navParams.data.popoverProps.frequency !== 'undefined') {
      console.log('this.navParams.data.popoverProps.frequency', this.navParams.data.popoverProps.frequency);
      this.options.enabled = this.navParams.data.popoverProps.frequency.enabled;
      this.options.repeat = this.navParams.data.popoverProps.frequency.repeat;
      this.options.count = this.navParams.data.popoverProps.frequency.count;
      this.options.when = this.navParams.data.popoverProps.frequency.when;
      if (this.options.repeat === 'weekly') {
        // TODO: Set days.
      }
    }
  }

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
