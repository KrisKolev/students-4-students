import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../model/user';
import {FirebaseService} from "./http/external/firebase.service";
import {RegistrationService} from "./http/backend/registration.service";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {verify} from "crypto";
import {UserService} from "./http/backend/user.service";
import {createGunzip} from "zlib";

@Injectable({providedIn: 'root'})
export class UserAuthService {

    private LOCAL_STORAGE_NAME = 'loggedInUser';

    public userObservable: Observable<User>;
    private userBehaviorSubject: BehaviorSubject<User>;

    constructor(public router: Router,
                private firebaseService: FirebaseService,
                private registrationService: RegistrationService,
                private userService:UserService) {
        this.userBehaviorSubject = new BehaviorSubject<User>(new User());
        this.userObservable = this.userBehaviorSubject.asObservable();
    }



    public register(email: string, password: string, firstname: string, lastname: string, nickname: string) {
        return this.registrationService.register(email, password, firstname, lastname, nickname);
    }

    public login(email: string, password: string) {
        let booleanPromise = this.firebaseService.firebaseSignin(email, password, this.LOCAL_STORAGE_NAME);
        let auth = getAuth();

        onAuthStateChanged(auth, (user) =>{
            if(auth.currentUser !== null){
                this.setUserId(auth.currentUser.uid);
                this.setEmail(auth.currentUser.email);
            }
        });

        return booleanPromise;
    }

    public logout() {
        return this.firebaseService.firebaseSignOut(this.LOCAL_STORAGE_NAME);
    }

    public getLoggedInUser(){
        let loggedInUser = localStorage.getItem(this.LOCAL_STORAGE_NAME);
        return loggedInUser !== null ? JSON.parse(loggedInUser) : null;
    }

    public isUserLoggedIn() {
        return this.getLoggedInUser() !== null ? true : false;
    }

    public setUserCoords(latitude: string, longitude: string) {
        this.userBehaviorSubject.value.latitude = latitude;
        this.userBehaviorSubject.value.longitude = longitude;
    }

    public setUserLocation(country: string, city: string) {
        this.userBehaviorSubject.value.detectedCountry = country;
        this.userBehaviorSubject.value.detectedCity = city;
    }

    public setUserId(uid: string) {
        this.userBehaviorSubject.value.id = uid;
    }

    public setEmail(email: string) {
        this.userBehaviorSubject.value.email = email;
    }

    public getUser() {
        return this.userBehaviorSubject.value;
    }

    public getAccessToken() {
        let loggedInUser = this.getLoggedInUser();
        if (this.isUserLoggedIn()) {
            return loggedInUser.stsTokenManager.accessToken;
        }
        return null;
    }

    public getRefreshToken() {
        let loggedInUser = this.getLoggedInUser();
        if (this.isUserLoggedIn()) {
            return loggedInUser.stsTokenManager.refreshToken;
        }
        return null;
    }

    public getTokenExpiration() {
        let loggedInUser = this.getLoggedInUser();
        if (this.isUserLoggedIn()) {
            return loggedInUser.stsTokenManager.expirationTime;
        }
        return null;
    }
}
