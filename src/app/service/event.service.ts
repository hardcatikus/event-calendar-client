import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
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

  public getEvent(id: number): Observable<Event>{
    return this.http.get<Event>(this.eventURL + 'rest/event/' + id);
  }

  public addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.eventURL + 'rest/event/add',event);
  }

  public getAllEventsByMeetingRoomAndDate(meetingRoom: number, dayStart: Date): Observable<Event[]> {
    let params = new HttpParams().set("meetingRoom", meetingRoom)
      .set("dayStart", String(dayStart));
    return this.http.get<Event[]>(this.eventURL +
      'rest/event/allByMeetingRoomAndDay', {params: params});
  }

  public updateEventLastVersion(id: number): Observable<String> {
    return this.http.patch<String>(this.eventURL + 'rest/event/' + id, {});
  }
}
