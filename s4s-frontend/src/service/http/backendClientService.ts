import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({providedIn: 'root'})
export class BackendClientService {

    constructor(private http: HttpClient) {
    }

    createGetCall<T>(path: string) {
        console.log('GET:' + environment.baseUrl + path);
        return this.http.get<T>(environment.baseUrl + path);
    }

    createPostCall<T>(path: string, body: any) {
        console.log('POST:' + environment.baseUrl + path);

        return this.http.post<T>(environment.baseUrl + path, body, httpOptions);
    }

    createPutCall<T>(path: string, body: any) {
        console.log('PUT:' + environment.baseUrl + path);

        return this.http.put<T>(environment.baseUrl + path, body, httpOptions);
    }

    createDeleteCall<T>(path: string) {
        console.log('DELETE:' + environment.baseUrl + path);

        return this.http.delete<T>(environment.baseUrl + path, httpOptions);
    }
}
