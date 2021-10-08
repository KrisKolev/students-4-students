import {Injectable} from '@angular/core';
import {BackendClientService} from "./backendClientService";

@Injectable({providedIn: 'root'})
export class HealthCheckService extends BackendClientService {

    getEcho() {
        return this.createGetCall('echo');
    }
}
