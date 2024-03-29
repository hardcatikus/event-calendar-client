import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Event } from '../model/event';
import {Observable} from "rxjs";
import {environment} from "../../environments/environments";
import {EventDTO} from "../dto/event-dto";

@Injectable()
export class EventService {

  private eventURL: string;

  constructor(private http: HttpClient) {
    this.eventURL = environment.apiBaseUrl;
  }
//eventcalendar/
  public getAllEvents(): Observable<Event[]>{
    return this.http.get<Event[]>(this.eventURL + 'rest/event/all');
  }

  public getEvent(id: number): Observable<Event>{
    return this.http.get<Event>(this.eventURL + 'rest/event/' + id);
  }

  public addEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.eventURL + 'rest/event/add',event);
  }

  public getAllEventsByMeetingRoomAndDate(meetingRoom: number, dayStart: string): Observable<Event[]> {
    let params = new HttpParams().set("meetingRoom", meetingRoom)
      .set("dayStart", dayStart);
    return this.http.get<Event[]>(this.eventURL + 'rest/event/allByMeetingRoomAndDay',
      {params: params});
  }

  public updateEventLastVersion(id: number): Observable<String> {
    return this.http.patch<String>(this.eventURL + 'rest/event/' + id, {});
  }

  public getAllEventsByDate(dayStart: string): Observable<Event[]> {
    let params = new HttpParams().set("dayStart", String(dayStart));
    return this.http.get<Event[]>(this.eventURL + 'rest/event/allByDay',
      {params: params});
  }

  public getAllEventStates(id: number): Observable<Event[]> {
    let params = new HttpParams().set("id", id);
    return  this.http.get<Event[]>(this.eventURL + 'rest/event/allStates',
      {params:params});
  }

  public getAllRelevantEvents(): Observable<EventDTO[]> {
    let stringDate: string;
    let currentDate = new Date();
    stringDate = currentDate.getFullYear() + "-" + (Number(currentDate.getMonth()) + 1) + "-" + currentDate.getDate();
    let params = new HttpParams().set("date", stringDate);
    return this.http.get<EventDTO[]>(this.eventURL + 'rest/event/allRelevant',
      {params:params});
  }

  public deleteObsoleteEvents(): Observable<String> {
    let stringDate: string;
    let currentDate = new Date();
    stringDate = currentDate.getFullYear() + "-" + (Number(currentDate.getMonth()) + 1) + "-" + currentDate.getDate();
    let params = new HttpParams().set("currentDate", stringDate);
    return this.http.delete<String>(this.eventURL + 'rest/event/allObsolete', {params:params});
  }

}
