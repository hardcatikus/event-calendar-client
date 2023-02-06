import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environments";
import {Observable} from "rxjs";
import {MeetingRoom} from "../model/meeting-room";

@Injectable()
export class MeetingRoomService {

  private eventURL: string;

  constructor(private http: HttpClient) {
    this.eventURL = environment.apiBaseUrl;
  }

  public getAllMeetingRooms(): Observable<MeetingRoom[]>{
    return this.http.get<MeetingRoom[]>(this.eventURL + 'rest/meeting-room/all');
  }

  public getMeetingRoom(id: number): Observable<MeetingRoom> {
    return this.http.get<MeetingRoom>(this.eventURL + 'rest/meeting-room/' +id);
  }

  public addMeetingRoom(meetingRoom: MeetingRoom): Observable<MeetingRoom>{
    return this.http.post<MeetingRoom>(this.eventURL + 'rest/meeting-room/add', meetingRoom);
  }

}
