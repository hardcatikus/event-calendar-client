import {Component} from '@angular/core';
import {MeetingRoom} from "../model/meeting-room";
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "../service/event.service";
import {MeetingRoomService} from "../service/meeting-room.service";
import {Event} from "../model/event";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  meetingRoomSelected: number;
  dateSelected: Date;
  events!: Event[];
  meetingRooms!: MeetingRoom [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private meetingRoomService: MeetingRoomService
  ) {
    this.meetingRoomSelected = 1;
    this.dateSelected = new Date();
  }


  ngOnInit() {
    this.eventService.getAllEvents().subscribe(data => {
        this.events = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.meetingRoomService.getAllMeetingRooms().subscribe(data => {
        this.meetingRooms = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}
