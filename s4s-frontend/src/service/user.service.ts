import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../model/user';

@Injectable({providedIn: 'root'})
export class UserService {
    public userObservable: Observable<User>;
    private userBehaviorSubject: BehaviorSubject<User>;

    constructor(public router: Router) {
        this.userBehaviorSubject = new BehaviorSubject<User>(new User());
        this.userObservable = this.userBehaviorSubject.asObservable();
    }

    public setUserCoords(latitude: string, longitude: string){
        this.userBehaviorSubject.value.latitude = latitude;
        this.userBehaviorSubject.value.longitude = longitude;
    }

    public setUserLocation(country: string, city: string){
        this.userBehaviorSubject.value.detectedCountry = country;
        this.userBehaviorSubject.value.detectedCity = city;
    }

    public getUser() {
        return this.userBehaviorSubject.value;
    }

    public setUserId(uid: string) {
        this.userBehaviorSubject.value.id = uid;
    }

    public setEmail(email: string) {
        this.userBehaviorSubject.value.email = email;
    }

    public setAccessToken(accessToken: string) {
        this.userBehaviorSubject.value.accessToken = accessToken;
    }
}
