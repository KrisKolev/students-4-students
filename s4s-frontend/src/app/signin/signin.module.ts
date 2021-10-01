import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin.component';
import { SigninRoutingModule } from './signin-routing.module';
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

@NgModule({
    declarations: [SigninComponent],
    imports: [
        CommonModule,
        SigninRoutingModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonToggleModule
    ]
})
export class SigninModule { }
