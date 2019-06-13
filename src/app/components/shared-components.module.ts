import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';
import { AngularCalendarComponent } from './common/angular-calendar/angular-calendar.component';

import { TodoListHeaderComponent, TodoListComponent, TodoListItemComponent, TodoListFooterComponent } from './todo/';

import { MoreOptionsPopoverComponent } from '../popovers/more-options/more-options.popover';

// Angular Calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, TodoListHeaderComponent, TodoListComponent,
     TodoListItemComponent, TodoListFooterComponent, MoreOptionsPopoverComponent, AngularCalendarComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgSelectModule
  ],
  exports: [FooterComponent, HeaderComponent, TodoListHeaderComponent, TodoListComponent, TodoListItemComponent,
            TodoListFooterComponent, MoreOptionsPopoverComponent, AngularCalendarComponent, CalendarModule, NgSelectModule],
  entryComponents: [MoreOptionsPopoverComponent]
})
export class SharedComponentsModule { }
