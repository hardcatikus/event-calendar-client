import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environments";
import {Observable} from "rxjs";
import {Purpose} from "../model/purpose";

@Injectable()
export class PurposeService {

  private eventURL: string;

  constructor(private http: HttpClient) {
    this.eventURL = environment.apiBaseUrl;
  }
//eventcalendar/
  public getAllPurposes(): Observable<Purpose[]> {
    return this.http.get<Purpose[]>(this.eventURL + 'rest/purpose/all');
  }

  public getPurpose(id: number): Observable<Purpose> {
    return this.http.get<Purpose>(this.eventURL + 'rest/purpose/' + id);
  }

  public addPurpose(purpose: Purpose): Observable<Purpose>{
    return this.http.post<Purpose>(this.eventURL + 'rest/purpose/add', purpose);
  }

  public deletePurpose(id: number): Observable<String> {
    return this.http.delete<String>(this.eventURL + 'rest/purpose/' + id);
  }

}
