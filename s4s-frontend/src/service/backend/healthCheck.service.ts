import {Injectable} from '@angular/core';
import {BackendClientService} from "../backendClientService";

@Injectable({providedIn: 'root'})
export class HealthCheckService extends BackendClientService {

    getEcho() {
<<<<<<< HEAD
        return this.createGetCall('echo');
=======
        return super.createGetCall('echo');
>>>>>>> feature/MessagingRework
    }
}
