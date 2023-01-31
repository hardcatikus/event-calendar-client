import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Event } from '../model/event';
import {Observable} from "rxjs";
import {environment} from "../../environments/environments";

@Injectable()
export class EventService {

  private eventURL: string;

  constructor(private http: HttpClient) {
    this.eventURL = environment.apiBaseUrl;
  }

  public getAllEvents(): Observable<Event[]>{
    return this.http.get<Event[]>(this.eventURL + 'rest/event/all');
  }

  public getEvent(id: number): Observable<void>{
    return this.http.get<void>(this.eventURL + 'rest/event/' + id);
  }

  public addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.eventURL + 'rest/event/add',event);
  }

}
