import { Component } from '@angular/core';
import {BackendCheckService} from '../service/backend_check.service';
import {GeolocationService} from '../service/geolocation.service';
import {UserService} from '../service/user.service';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {FirebaseService} from '../service/firebase.service';
import firebase from 'firebase/compat';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Students4Students';
    search : String ="";

    constructor(private backendCheckService: BackendCheckService,
                private geolocationService: GeolocationService,
                private firebaseService: FirebaseService,
                public userService: UserService,
                public loginDialog: MatDialog) {
        this.checkBackendConnection();
        this.initGeolocation();
    }

    private checkBackendConnection() {
        this.backendCheckService.getEcho().subscribe(res => {
            console.log(res);
        });
    }

    private initGeolocation() {
        if (!navigator.geolocation) {
            console.log('geolocation is not supported!');
        } else {
            navigator.geolocation.getCurrentPosition((position => {
                this.userService.setUserCoords(String(position.coords.latitude), String(position.coords.longitude));

                this.geolocationService.getGeoInformation(
                    this.userService.getUser().latitude,
                    this.userService.getUser().longitude).subscribe(res => {
                    console.log(res);
                    this.userService.setUserLocation(res.countryName, res.city);
                    console.log(this.userService.getUser());
                });
            }));
        }
    }
    openLoginDialog(): void {
        const dialogRef = this.loginDialog.open(LoginDialogComponent);
    }
    getLoginStatus()
    {
        return this.firebaseService.getLoginStatus();
    }
    logout()
    {
        this.firebaseService.logout();
    }
}
