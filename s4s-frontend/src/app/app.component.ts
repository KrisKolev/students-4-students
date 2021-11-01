import { Component, OnInit } from '@angular/core';
import {HealthCheckService} from '../service/http/backend/healthCheck.service';
import {GeoLocationService} from '../service/http/external/geoLocation.service';
import {UserAuthService} from '../service/userAuthService';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {UserService} from "../service/http/backend/user.service";
import {FirebaseService} from "../service/http/external/firebase.service";


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent{
    title = 'Students4Students';
    image = 'assets/images/logo.png'
    search: String ="";


    constructor(private healthCheckService: HealthCheckService,
                private geolocationService: GeoLocationService,
                public userAuthService: UserAuthService,
                public loginDialog: MatDialog,
                private userService:UserService,
                private firebaseService: FirebaseService) {
        this.checkBackendConnection();
        this.initGeolocation();
        this.verifyCurrentUser();
    }

    private checkBackendConnection() {
        this.healthCheckService.getEcho().subscribe(res => {
            console.log(res);
        });
    }

    private initGeolocation() {
        if (!navigator.geolocation) {
            console.log('geolocation is not supported!');
        } else {
            navigator.geolocation.getCurrentPosition((position => {
                this.userAuthService.setUserCoords(String(position.coords.latitude), String(position.coords.longitude));

                this.geolocationService.getGeoInformation(
                    this.userAuthService.getUser().latitude,
                    this.userAuthService.getUser().longitude).subscribe(res => {
                    console.log(res);
                    this.userAuthService.setUserLocation(res.countryName, res.city);
                    console.log(this.userAuthService.getUser());
                });
            }));
        }
    }

    /**
     * Verifies the currently logged in user. If access token has expired, logged-in user will be signed out
     * @private
     */
    private verifyCurrentUser(){
        this.userService.verifyUser().subscribe((x=>{
            console.log(x);
        }),error => {
            console.log(error)
            this.firebaseService.firebaseSignOut("loggedInUser")
        })
    }

    openLoginDialog(): void {
        const dialogRef = this.loginDialog.open(LoginDialogComponent);
    }
    isUserLoggedIn()
    {
        return this.userAuthService.isUserLoggedIn();
    }
    logout()
    {
        this.userAuthService.logout();
    }

}
