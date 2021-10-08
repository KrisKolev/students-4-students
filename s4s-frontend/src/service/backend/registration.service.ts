import {Injectable} from '@angular/core';
import {BackendClientService} from "../backendClientService";

@Injectable({providedIn: 'root'})
export class RegistrationService extends BackendClientService {

    register(email: string, password: string) {
        return this.createPostCall('user/registration', {
            'email': email,
            'password': password,
            'firstname': '',
            'lastname': '',
            'uid': ''
        });
    }
}
