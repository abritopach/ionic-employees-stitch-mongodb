import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-more-options-popover',
  templateUrl: 'more-options.popover.html',
  styleUrls: ['./more-options.popover.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MoreOptionsPopoverComponent implements OnInit, OnDestroy {

  constructor(private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  updateItem() {
    console.log('MoreOptionsPopoverComponent::updateItem | method called');
  }

  deleteItem() {
    console.log('MoreOptionsPopoverComponent::deleteItem | method called');
  }

}
