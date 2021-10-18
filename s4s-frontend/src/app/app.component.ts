import {Component} from '@angular/core';
import {HealthCheckService} from '../service/http/backend/healthCheck.service';
import {GeoLocationService} from '../service/http/external/geoLocation.service';
import {UserAuthService} from '../service/userAuthService';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {FirebaseService} from '../service/firebase.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Students4Students';
    search: String ="";

    constructor(private healthCheckService: HealthCheckService,
                private geolocationService: GeoLocationService,
                private firebaseService: FirebaseService,
                public userAuthService: UserAuthService,
                public loginDialog: MatDialog) {
        this.checkBackendConnection();
        this.initGeolocation();
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
