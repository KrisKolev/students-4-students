import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import {FirebaseService} from '../service/firebase.service';
import {initializeApp} from "firebase/app";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

const firebaseConfig = {
    apiKey: "AIzaSyDaF7WsFkyX5rr37M_kCHz3oovCDJ4Il-U",
    authDomain: "students4students-f2e07.firebaseapp.com",
    projectId: "students4students-f2e07",
    storageBucket: "students4students-f2e07.appspot.com",
    messagingSenderId: "148128489605",
    appId: "1:148128489605:web:fe41a4249539e2b85749ec"
};
const app = initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent
  ],

    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonToggleModule,
        FormsModule,
        NgbModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})

export class AppModule {
    constructor() {

    }
}
