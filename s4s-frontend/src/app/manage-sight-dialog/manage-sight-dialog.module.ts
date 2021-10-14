import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSightDialogComponent } from './manage-sight-dialog.component';
import { ManageSightDialogRoutingModule } from './manage-sight-dialog-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {GoogleMapsModule} from "@angular/google-maps";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AddRatingComponent} from "../add-rating/add-rating.component";
import {MatExpansionModule} from "@angular/material/expansion";

@NgModule({
    declarations: [ManageSightDialogComponent,AddRatingComponent],
    imports: [
        CommonModule,
        ManageSightDialogRoutingModule,
        FlexLayoutModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatGridListModule,
        MatAutocompleteModule,
        GoogleMapsModule,
        MatButtonToggleModule,
        MatTooltipModule,
        MatExpansionModule,
        FormsModule
    ]
})
export class ManageSightDialogModule { }
