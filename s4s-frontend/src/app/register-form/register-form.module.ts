import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from './register-form.component';
import { RegisterFormRoutingModule } from './register-form-routing.module';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

@NgModule({
    declarations: [RegisterFormComponent],
    imports: [
        CommonModule,
        RegisterFormRoutingModule,
        MatInputModule,
        MatIconModule,
        MatButtonToggleModule,
    ]
})
export class RegisterFormModule { }
