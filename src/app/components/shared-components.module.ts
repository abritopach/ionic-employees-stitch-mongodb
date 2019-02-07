import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';

import { TodoListHeaderComponent, TodoListComponent, TodoListItemComponent, TodoListFooterComponent } from './todo/';

@NgModule({
  declarations: [FooterComponent, HeaderComponent, TodoListHeaderComponent, TodoListComponent,
     TodoListItemComponent, TodoListFooterComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [FooterComponent, HeaderComponent, TodoListHeaderComponent, TodoListComponent, TodoListItemComponent, TodoListFooterComponent]
})
export class SharedComponentsModule { }
