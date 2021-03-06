import {Component} from '@angular/core';
import {HealthCheckService} from '../service/http/backend/healthCheck.service';
import {GeoLocationService} from '../service/http/external/geoLocation.service';
import {UserAuthService} from '../service/userAuthService';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {UserService} from "../service/http/backend/user.service";
import {FirebaseService} from "../service/http/external/firebase.service";
import {Emitters} from "./emitters/emitters";
import {Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Students4Students';
    image = 'assets/images/logo.png'
    search: String = "";
    profilePictureUrl: any;
    loggedInUser;

    constructor(private healthCheckService: HealthCheckService,
                private geolocationService: GeoLocationService,
                public userAuthService: UserAuthService,
                public loginDialog: MatDialog,
                private userService:UserService,
                private firebaseService: FirebaseService,
                private router: Router) {
        this.checkBackendConnection();
        this.initGeolocation();
        this.verifyCurrentUser();
        this.getProfilePictureUrl();
        Emitters.pfpEmitter.subscribe(
            (pfp:boolean)=>{
                if(pfp==true)
                {
                    this.getProfilePictureUrl();
                }
                else
                {
                    this.profilePictureUrl=null;
                }
            }
        );
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
    private verifyCurrentUser() {
        this.userService.verifyUser().subscribe((x => {
            console.log(x);
        }), error => {
            console.log(error)
            this.firebaseService.firebaseSignOut("loggedInUser")
        })
    }

    openLoginDialog(): void {

        const dialogRef = this.loginDialog.open(LoginDialogComponent);
    }

    isUserLoggedIn() {
        return this.userAuthService.isUserLoggedIn();
    }

    logout() {

        this.profilePictureUrl = null;
        this.userAuthService.logout();
    }
  
    getProfilePictureUrl() {
         if (!this.userAuthService.isUserLoggedIn()){return;}
         this.firebaseService.getProfilePictureUrl(this.userAuthService.getLoggedInUser()).then(data => {

             this.profilePictureUrl=data;
             console.log(this.profilePictureUrl)
            this.checkProfilePictureAvailability();
         });
    }

    checkProfilePictureAvailability(){

        if (this.profilePictureUrl){
            return true;
        }
        else return false;
    }

    onOpenManageSight() {
        this.router.navigate(['./manageSight','1'])
    }
}

