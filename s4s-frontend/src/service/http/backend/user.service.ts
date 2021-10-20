import {Injectable} from '@angular/core';
import {BackendClientService} from "../backendClientService";

@Injectable({providedIn: 'root'})
export class UserService extends BackendClientService {

    verifyUser() {
        return this.createGetCall('user/verify');
    }
}