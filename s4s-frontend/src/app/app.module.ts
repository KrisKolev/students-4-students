import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import { RegisterFormComponent } from './register-form/register-form.component';
import {FirebaseService} from '../service/firebase.service';
import {initializeApp} from "firebase/app";

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
    AppComponent,
    RegisterFormComponent
  ],

    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatToolbarModule,
        MatIconModule
    ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})

export class AppModule {
    constructor() {

    }
}
