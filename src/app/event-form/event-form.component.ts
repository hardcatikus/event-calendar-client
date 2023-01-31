import { Component } from '@angular/core';
import {Event} from "../model/event";
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "../service/event.service";
import {MeetingRoom} from "../model/meeting-room";
import {HttpErrorResponse} from "@angular/common/http";
import {MeetingRoomService} from "../service/meeting-room.service";
import {Purpose} from "../model/purpose";
import {PurposeService} from "../service/purpose.service";

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {

  event: Event;
  meetingRooms!: MeetingRoom [];
  purposes!: Purpose [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private meetingRoomService: MeetingRoomService,
    private purposeService: PurposeService
  ) {
    this.event = new Event();
  }

  ngOnInit() {
    this.event.purpose = 0;
    this.event.meetingRoom = 0;
    this.meetingRoomService.getAllMeetingRooms().subscribe(data => {
        this.meetingRooms = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.purposeService.getAllPurposes().subscribe(data => {
        this.purposes = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onSubmit(){
    this.event.initialState = 0;
    let currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 3);
    this.event.creationTime = currentTime;
    this.eventService.addEvent(this.event).subscribe(result => this.gotoCalendar());
  }

  gotoCalendar(){
    this.router.navigate(['/calendar']);
  }

  compareDates(): boolean{
    const startDate = new Date(this.event.startTime);
    const endDate = new Date(this.event.endTime);
    return startDate >= endDate;
  }
}
