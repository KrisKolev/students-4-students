import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({providedIn: 'root'})
export class GeolocationService {

    constructor(private http: HttpClient) {
    }

    getGeoInformation(lat: string, lon: string) {
        return this.http.get<any>('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='
            + lat + '&longitude=' + lon + '&localityLanguage=en');
    }
}
