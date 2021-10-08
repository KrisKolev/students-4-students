import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class GeoLocationService {

    constructor(private http: HttpClient) {
    }

    public getGeoInformation(lat: string, lon: string) {
        return this.http.get<any>(environment.geoLocationServiceUrl + '?latitude=' + lat + '&longitude=' + lon + '&localityLanguage=en');
    }
}
