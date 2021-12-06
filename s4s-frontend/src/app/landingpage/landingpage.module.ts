import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingpageComponent } from './landingpage.component';
import { LandingpageRoutingModule } from './landingpage-routing.module';
import {MatCardModule} from "@angular/material/card";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {GoogleMapsModule} from "@angular/google-maps";
import {MatButtonModule} from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatListModule} from "@angular/material/list";
import {ManageSightDialogModule} from "../manage-sight-dialog/manage-sight-dialog.module";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {MatSliderModule} from "@angular/material/slider";
import {SightListItemComponent} from "./components/sight-list-item/sight-list-item.component";
import {MatIconModule} from "@angular/material/icon";
import { SightDetailComponent } from './components/sight-detail/sight-detail.component';
import {MatChipsModule} from "@angular/material/chips";

@NgModule({
  declarations: [LandingpageComponent, SightListItemComponent, SightDetailComponent],
    imports: [
        CommonModule,
        LandingpageRoutingModule,
        MatCardModule,
        NgbCarouselModule,
        GoogleMapsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        MatListModule,
        ManageSightDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatSliderModule,
        MatIconModule,
        MatChipsModule
    ]
})
export class LandingpageModule { }
