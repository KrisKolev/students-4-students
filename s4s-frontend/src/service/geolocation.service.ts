import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

const geoLocationServiceUrl = 'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=';

@Injectable({providedIn: 'root'})
export class GeolocationService {

    constructor(private http: HttpClient) {
    }

    public getGeoInformation(lat: string, lon: string) {
        return this.http.get<any>(geoLocationServiceUrl + lat + '&longitude=' + lon + '&localityLanguage=en');
    }
}
