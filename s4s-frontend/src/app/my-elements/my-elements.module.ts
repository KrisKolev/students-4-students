import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MyElementsComponent, MyElementsDeleteConfirmDialog} from "./my-elements.component";
import {MatTabsModule} from "@angular/material/tabs";
import {MyElementsRoutingModule} from "./my-elements-routing.module";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
    declarations: [MyElementsComponent,MyElementsDeleteConfirmDialog],
    exports: [

    ],
    imports: [
        CommonModule,
        MyElementsRoutingModule,
        MatTabsModule,
        MatTableModule,
        MatSortModule,
        MatButtonModule,
        MatDialogModule
    ]
})
/**
 * Model for manage sight component.
 * Component written by Michael Fahrafellner
 * creation date: 30.11.2021
 * last change done by: Michael Fahrafellner
 */
export class MyElementsModule { }
