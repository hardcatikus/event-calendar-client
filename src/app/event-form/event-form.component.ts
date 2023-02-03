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

  startTimeString!: string;
  endTimeString!: string;
  event: Event;
  meetingRooms!: MeetingRoom [];
  purposes!: Purpose [];
  formOfChanges: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private meetingRoomService: MeetingRoomService,
    private purposeService: PurposeService
  ) {
    this.event = new Event();
    this.formOfChanges = false;
    this.route.queryParams.subscribe((queryParams:any) => {
      let id = queryParams.eventId;
      if(id){
        this.fillFormElements(id);
        this.formOfChanges = true;
      }
    })
  }

  ngOnInit() {
    //this.startTimeString = new Date().toISOString().substring(0, 16);
    //(document.getElementById("startTime") as HTMLInputElement).value = this.startTimeString;
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
    this.event.lastVersion = true;
    if (this.formOfChanges) {
      if (this.event.initialState == 0) {
        this.event.initialState = this.event.id;
        this.cancelPreviousEvent();
      }
      else{
        this.cancelPreviousEvent();
      }
    }
    else{
      this.event.creationTime = this.addThreeHours(new Date());
      this.event.startTime = this.addThreeHours(this.event.startTime);
      this.event.endTime = this.addThreeHours(this.event.endTime);
      this.event.initialState = 0;
    }
    this.event.id = 0;
    this.eventService.addEvent(this.event).subscribe(result => {
      this.gotoCalendar();
      if (this.formOfChanges) {
        alert("Событие было обновлено");
      }
      else{
        alert("Событие было добавлено");
      }
    });
  }

  gotoCalendar(){
    this.router.navigate(['/calendar']);
  }

  compareDates(): boolean{
    const startDate = new Date(this.startTimeString);
    const endDate = new Date(this.endTimeString);
    return startDate >= endDate;
  }

  fillFormElements(id: number){
    this.eventService.getEvent(id).subscribe(data => {
        this.event = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }, () => {
      this.startTimeString = new Date(this.event.startTime).toISOString().substring(0, 16);
      this.endTimeString = new Date(this.event.endTime).toISOString().substring(0, 16);
      });
  }

  endTimeChange(){
    this.event.endTime = new Date(this.endTimeString);
  }

  startTimeChange(){
    this.event.startTime = new Date(this.startTimeString);
  }

  addThreeHours(date: Date): Date {
    let newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 3);
    return newDate;
  }

  cancelPreviousEvent(){
    this.eventService.updateEventLastVersion(this.event.id).subscribe(data => {},
      (error: HttpErrorResponse) => {
        alert(error.message);
      })
  }

}
