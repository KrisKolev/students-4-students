import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FirebaseService} from '../service/http/external/firebase.service';
import {initializeApp} from 'firebase/app';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CustomHttpInterceptor} from "../service/interceptor/interceptor.service";
import { ErroPopUpComponent } from './erro-pop-up/erro-pop-up.component';


const firebaseConfig = {
    apiKey: 'AIzaSyDaF7WsFkyX5rr37M_kCHz3oovCDJ4Il-U',
    authDomain: 'students4students-f2e07.firebaseapp.com',
    projectId: 'students4students-f2e07',
    storageBucket: 'students4students-f2e07.appspot.com',
    messagingSenderId: '148128489605',
    appId: '1:148128489605:web:fe41a4249539e2b85749ec'
};
const app = initializeApp(firebaseConfig);

@NgModule({
    declarations: [
        AppComponent,
        LoginDialogComponent,
        ErroPopUpComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        HttpClientModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    providers: [FirebaseService, {provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true}],
    entryComponents: [LoginDialogComponent],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor() {
    }
}
