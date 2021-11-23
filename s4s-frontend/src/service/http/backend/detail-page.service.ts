import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DetailPageService {

  readonly REST_API_SIGHT_BY_ID;

  constructor(private http: HttpClient) {
    this.REST_API_SIGHT_BY_ID = 'http://localhost:8080/s4s-backend/api/sights/{id}';
  }

  getSightById() {
    return this.http.get(`${this.REST_API_SIGHT_BY_ID}`);
  }
}
