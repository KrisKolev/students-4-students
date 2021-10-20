import {Injectable} from '@angular/core';
import {BackendClientService} from "../backendClientService";
import {Sight} from "../../../model/sight";

@Injectable({providedIn: 'root'})
/**
 * Sights services to use for backend communication
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class SightsService extends BackendClientService {

    /**
     * Adds a sight to the database
     * Component written by Michael Fahrafellner
     * creation date: 16.10.2021
     * last change done by: Michael Fahrafellner
     */
    addSight(sight: Sight,user:String){
        return this.createPostCall('sights/sight?user='+user,JSON.stringify(sight));
    }

    /**
     * Gets all sight labels from the database
     * Component written by Michael Fahrafellner
     * creation date: 16.10.2021
     * last change done by: Michael Fahrafellner
     */
    getLabels(){
        return this.createGetCall('sights/labels');
    }

    /**
     * Gets all sights from the database
     * Component written by Michael Fahrafellner
     * creation date: 16.10.2021
     * last change done by: Michael Fahrafellner
     */
    getSights(){
        return this.createGetCall('sights/allsights');
    }
}