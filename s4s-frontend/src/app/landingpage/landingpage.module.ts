import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingpageComponent } from './landingpage.component';
import { LandingpageRoutingModule } from './landingpage-routing.module';
import {MatCardModule} from "@angular/material/card";
import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [LandingpageComponent],
    imports: [
        CommonModule,
        LandingpageRoutingModule,
        MatCardModule,
        NgbCarouselModule
    ]
})
export class LandingpageModule { }
