import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { PopoverController, NavParams} from '@ionic/angular';

@Component({
  selector: 'app-more-options1-popover',
  templateUrl: 'more-options1.popover.html',
  styleUrls: ['./more-options1.popover.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MoreOptions1PopoverComponent implements OnInit, OnDestroy {

  options: any;

  constructor(private popoverCtrl: PopoverController, private navParams: NavParams, ) {
  }

  ngOnInit() {
    this.options = this.navParams.data.popoverProps.options;
    console.log(this.options);
  }

  ngOnDestroy() {
  }

  deleteNote() {
    console.log('MoreOptions1PopoverComponent::deleteNote | method called');
  }

  archiveNote() {
    console.log('MoreOptions1PopoverComponent::archiveNote | method called');
  }

  deleteAllNotes() {
    console.log('MoreOptions1PopoverComponent::deleteAllNotes | method called');
  }

  archiveAllNotes() {
    console.log('MoreOptions1PopoverComponent::archiveAllNotes | method called');
  }

  deselectAll() {
    console.log('MoreOptions1PopoverComponent::deselectAll | method called');
    this.popoverCtrl.dismiss({option: 'deselect'});
  }

  deleteSelected() {
    console.log('MoreOptions1PopoverComponent::deleteSelected | method called');
    this.popoverCtrl.dismiss({option: 'delete'});
  }

}
