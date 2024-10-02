import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { AccordionModule } from 'primeng/accordion';



@NgModule({
  declarations: [],
  imports: [
    TagModule,
    ToastModule,
    TableModule,
    DialogModule,
    ButtonModule,
    MenubarModule,
    ToolbarModule,
    DataViewModule,
    CalendarModule,
    AccordionModule,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule,
    ConfirmDialogModule,

  ],
  exports: [
    TagModule,
    ToastModule,
    TableModule,
    DialogModule,
    ButtonModule,
    MenubarModule,
    ToolbarModule,
    DataViewModule,
    AccordionModule,
    CalendarModule,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule,
    ConfirmDialogModule,
  ]
})
export class PrimengModule { }
