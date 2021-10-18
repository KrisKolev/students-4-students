import {Injectable} from "@angular/core";
import {BackendClientService} from "../backendClientService";
import {List} from "../../../model/list";
import {Country} from "../../../model/location";

@Injectable({providedIn: 'root'})
/**
 * Location services to use for backend communication
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class LocationService extends BackendClientService {

    /**
     * Loads all countries of the world.
     * Component written by Michael Fahrafellner
     * creation date: 16.10.2021
     * last change done by: Michael Fahrafellner
     */
    getCountries(){
        return this.createGetCall('location/getCountries');
    }

    /**
     * Loads all data for cities and countries of the world
     * Component written by Michael Fahrafellner
     * creation date: 16.10.2021
     * last change done by: Michael Fahrafellner
     */
    getAllData(){
        return this.createGetCall('location/allData');
    }

    /**
     * Loads all cities for a specific country.
     * Component written by Michael Fahrafellner
     * creation date: 16.10.2021
     * last change done by: Michael Fahrafellner
     */
    getCitiesFromCountry(countryId: string){
        return this.createPostCall('location/getCities', {
            'uid': countryId
        });
    }
}
