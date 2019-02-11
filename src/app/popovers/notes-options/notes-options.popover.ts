import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-notes-options-popover',
  templateUrl: 'notes-options.popover.html',
  styleUrls: ['./notes-options.popover.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotesOptionsPopoverComponent implements OnInit, OnDestroy {

  constructor(private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
