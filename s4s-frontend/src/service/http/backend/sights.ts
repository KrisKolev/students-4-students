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

    /**
     * Gets all ratings of a user
     * Component written by Michael Fahrafellner
     * creation date: 30.11.2021
     * last change done by: Michael Fahrafellner
     **/
    getUserRatings(user:String){
        return this.createGetCall('sights/myratings?id='+user)
    }

    /**
     * Deletes a single rating
     * Component written by Michael Fahrafellner
     * creation date: 30.11.2021
     * last change done by: Michael Fahrafellner
     **/
    deleteRating(ratingId: String){
        return this.createDeleteCall('sights/deleteRating?id='+ratingId)
    }

    /**
     * Gets all sights of a user
     * Component written by Michael Fahrafellner
     * creation date: 30.11.2021
     * last change done by: Michael Fahrafellner
     **/
    getUserSights(user:String){
        return this.createGetCall('sights/mysights?id='+user)
    }

    /**
     * Gets all sights of a user
     * Component written by Michael Fahrafellner
     * creation date: 30.11.2021
     * last change done by: Michael Fahrafellner
     **/
    deleteSight(sightId: String){
        return this.createDeleteCall('sights/deleteSight?id='+sightId)
    }
}