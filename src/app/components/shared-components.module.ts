import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';

import { TodoListHeaderComponent, TodoListComponent, TodoListItemComponent, TodoListFooterComponent } from './todo/';

import { MoreOptions1PopoverComponent } from '../popovers/more-options.1/more-options1.popover';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, TodoListHeaderComponent, TodoListComponent,
     TodoListItemComponent, TodoListFooterComponent, MoreOptions1PopoverComponent],
  imports: [
  CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [FooterComponent, HeaderComponent, TodoListHeaderComponent, TodoListComponent, TodoListItemComponent,
            TodoListFooterComponent, MoreOptions1PopoverComponent],
  entryComponents: [MoreOptions1PopoverComponent]
})
export class SharedComponentsModule { }
