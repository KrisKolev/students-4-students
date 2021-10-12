import {Injectable} from "@angular/core";
import {BackendClientService} from "../backendClientService";
import {List} from "../../../model/list";
import {Country} from "../../../model/location";

@Injectable({providedIn: 'root'})
export class LocationService extends BackendClientService {

    getCountries(){
        return this.createGetCall('location/getCountries');
    }
}
