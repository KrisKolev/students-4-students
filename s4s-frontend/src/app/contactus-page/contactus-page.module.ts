import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ContactusPageRoutingModule} from "./contactus-page-routing.module";
import {ContactusPageComponent} from "./contactus-page.component";
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';


@NgModule({
    declarations: [ContactusPageComponent],
    imports: [
        CommonModule,
        ContactusPageRoutingModule,
        MatCardModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule

    ]
})
export class ContactusPageMmodule {
    constructor() {
}
}