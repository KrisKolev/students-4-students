import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilepageComponent } from "./profilepage.component";
import { ProfilepageRoutingModule } from './profilepage-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {ManageSightDialogModule} from "../manage-sight-dialog/manage-sight-dialog.module";

@NgModule({
    declarations: [ProfilepageComponent],
    imports: [
        CommonModule,
        ProfilepageRoutingModule,
        FlexLayoutModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatListModule,
        MatSidenavModule,
        ManageSightDialogModule,
    ]
})
export class ProfilepageModule { }
