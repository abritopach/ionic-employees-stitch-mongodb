import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-todo-options-popover',
  templateUrl: 'todo-options.popover.html',
  styleUrls: ['./todo-options.popover.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TodoOptionsPopoverComponent implements OnInit, OnDestroy {

  constructor(private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  deselectAll() {
    console.log('TodoOptionsPopoverComponent::deselectAll | method called');
    this.popoverCtrl.dismiss({option: 'deselect'});
  }

  deleteSelected() {
    console.log('TodoOptionsPopoverComponent::deleteSelected | method called');
    this.popoverCtrl.dismiss({option: 'delete'});
  }

}
