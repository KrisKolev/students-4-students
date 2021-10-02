import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({providedIn: 'root'})
export class RegistrationService {

    constructor(public router: Router, private http: HttpClient) {
    }

    register(email: string, password: string) {
        return this.http.post<any>(environment.baseUrl + 'user/registration',
            {
                'email': email,
                'password': password,
                'firstname': '',
                'lastname': '',
                'uid': ''
            }, httpOptions);
    }
}
