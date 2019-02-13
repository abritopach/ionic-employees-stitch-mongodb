import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Todo } from '../../../models/todo.model';

import * as moment from 'moment';

import { MoreOptionsPopoverComponent } from '../../../popovers/more-options/more-options.popover';

@Component({
  selector: 'app-todo-list-header',
  templateUrl: './todo-list-header.component.html',
  styleUrls: ['./todo-list-header.component.scss']
})
export class TodoListHeaderComponent implements OnInit {

  list = {
    title: 'My list'
  };
  editTitle = false;
  newTodo: Todo = {
    id: 0,
    title: '',
    complete: false,
    dateTime: moment().format('DD-MM-YYYY HH:mm:ss')
  };

  @Input()
  noteTitle;

  @Output()
  add: EventEmitter<Todo> = new EventEmitter();

  @Output()
  option: EventEmitter<any> = new EventEmitter();

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {
  }

  addTodo() {
    this.add.emit(this.newTodo);
    this.newTodo = {
      id: 0,
      title: '',
      complete: false,
      dateTime: moment().format('DD-MM-YYYY HH:mm:ss')
    };
  }

  async presentPopover() {
    const componentProps = { popoverProps: { title: 'Options',
      options: [
        {name: 'Deselect all elements', icon: 'checkbox-outline', function: 'deselectAll'},
        {name: 'Delete selected items', icon: 'close-circle-outline', function: 'deleteSelected'}
      ]
    }};
    const popover = await this.popoverCtrl.create({
      component: MoreOptionsPopoverComponent,
      componentProps: componentProps
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

    if (data) {
      console.log('data popover.onWillDismiss', data);
      this.option.emit(data);
    }

  }

}
