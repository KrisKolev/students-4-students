import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingpageComponent } from './landingpage.component';
import { LandingpageRoutingModule } from './landingpage-routing.module';
import {MatCardModule} from "@angular/material/card";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import {GoogleMapsModule} from "@angular/google-maps";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";


@NgModule({
  declarations: [LandingpageComponent],
    imports: [
        CommonModule,
        LandingpageRoutingModule,
        MatCardModule,
        NgbCarouselModule,
        GoogleMapsModule,
        MatButtonModule,
        MatFormFieldModule,

    ]
})
export class LandingpageModule { }
