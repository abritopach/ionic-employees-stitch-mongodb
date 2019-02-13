import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';

import { TodoListHeaderComponent, TodoListComponent, TodoListItemComponent, TodoListFooterComponent } from './todo/';

import { MoreOptionsPopoverComponent } from '../popovers/more-options/more-options.popover';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, TodoListHeaderComponent, TodoListComponent,
     TodoListItemComponent, TodoListFooterComponent, MoreOptionsPopoverComponent],
  imports: [
  CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [FooterComponent, HeaderComponent, TodoListHeaderComponent, TodoListComponent, TodoListItemComponent,
            TodoListFooterComponent, MoreOptionsPopoverComponent],
  entryComponents: [MoreOptionsPopoverComponent]
})
export class SharedComponentsModule { }
