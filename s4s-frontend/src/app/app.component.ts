import {Component} from '@angular/core';
import {HealthCheckService} from '../service/backend/healthCheck.service';
import {GeoLocationService} from '../service/external/geoLocation.service';
import {UserService} from '../service/user.service';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Students4Students';
    search: String = "";

    constructor(private healthCheckService: HealthCheckService,
                private geolocationService: GeoLocationService,
                public userService: UserService,
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
}
