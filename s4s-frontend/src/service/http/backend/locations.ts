import {Injectable} from "@angular/core";
import {BackendClientService} from "../backendClientService";

@Injectable({providedIn: 'root'})
export class LocationService extends BackendClientService {

    getCountries() {
        var result = this.createGetCall('location/getCountries')
        return this.createGetCall('echo');
    }
}
