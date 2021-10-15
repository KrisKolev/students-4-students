import {Injectable} from '@angular/core';
import {BackendClientService} from "../backendClientService";
import {Sight} from "../../../model/sight";

@Injectable({providedIn: 'root'})
export class SightsService extends BackendClientService {

    addSight(sight: Sight){
        return this.createPostCall('sights/addSight',JSON.stringify(sight));
    }

    getLabels(){
        return this.createGetCall('sights/getLabels');
    }
}