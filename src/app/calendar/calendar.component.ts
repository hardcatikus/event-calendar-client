import {Component} from '@angular/core';
import {MeetingRoom} from "../model/meeting-room";
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "../service/event.service";
import {MeetingRoomService} from "../service/meeting-room.service";
import {Event} from "../model/event";
import {HttpErrorResponse} from "@angular/common/http";
import {Purpose} from "../model/purpose";
import {PurposeService} from "../service/purpose.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  meetingRoomSelected: number;
  dateSelected!: Date;
  eventSelected!: Event;
  events!: Event [];
  meetingRooms!: MeetingRoom [];
  eventSelectedMeetingRoom!: MeetingRoom;
  eventSelectedPurpose!: Purpose;
  static nextColour: number = 0;
  static coloursArray: readonly string[]= ["#ff0000", "#d20202", "#8f0101", "#6e0101",
                                            "#f67676", "#be5d5d", "#8d4444", "#653131",
                                            "#fd1515", "#cc1414", "#8f0f0f", "#560909",
                                            "#fd3a3a", "#c52f2f", "#7c1d1d", "#4d1212",
                                            "#fa6d6d", "#be5151", "#7e3737", "#502222"];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private meetingRoomService: MeetingRoomService,
    private purposeService: PurposeService
  ) {
    this.meetingRoomSelected = 1;
  }

  ngOnInit() {
    this.getMeetingRoomsFromDB();
    let button = document.getElementById("buttonFillCalendar");
    if(button){
      button.setAttribute("disabled","true");
    }
    this.hideEventDetails();
  }

  enableButton(){
    let button = document.getElementById("buttonFillCalendar");
    if(button){
      button.removeAttribute("disabled");
    }
  }

  fillCalendar(){
    this.hideEventDetails();
    this.clearCells();
    if(this.meetingRoomSelected == 100){
      this.eventService.getAllEventsByDate(this.dateSelected).subscribe(data => {
          this.events = data;
          this.checkEvents();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    else{
      this.eventService.getAllEventsByMeetingRoomAndDate(this.meetingRoomSelected,
        String(this.dateSelected)).subscribe(data => {
          this.events = data;
          this.checkEvents();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  private getMeetingRoomsFromDB(){
    this.meetingRoomService.getAllMeetingRooms().subscribe(data => {
        this.meetingRooms = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private checkEvents(){
    if(this.events.length > 0){
      for(let eventNumber = 0; eventNumber < this.events.length; eventNumber++){
        let eventStartTime = new Date(this.events[eventNumber].startTime);
        let eventEndTime = new Date(this.events[eventNumber].endTime);
        let cellStartTimeBound = new Date(this.dateSelected);
        cellStartTimeBound.setHours(7);
        cellStartTimeBound.setMinutes(50);
        cellStartTimeBound.setSeconds(0);
        let cellEndTimeBound = new Date(cellStartTimeBound);
        cellEndTimeBound.setMinutes(cellEndTimeBound.getMinutes() + 10);
        for(let cellNumber = 1; cellNumber <= 72; cellNumber++){
          cellStartTimeBound.setMinutes(cellStartTimeBound.getMinutes() + 10);
          cellEndTimeBound.setMinutes(cellEndTimeBound.getMinutes() + 10);
          if((cellStartTimeBound <= eventStartTime)
            && (cellEndTimeBound > eventStartTime)){
            this.paintCell(cellNumber,this.events[eventNumber].id);
          }
          else if((cellStartTimeBound <= eventEndTime)
            && (cellEndTimeBound > eventEndTime)){
            this.paintCell(cellNumber,this.events[eventNumber].id);
          }
          else if((cellStartTimeBound > eventStartTime)
            && (cellEndTimeBound <= eventEndTime)){
            this.paintCell(cellNumber,this.events[eventNumber].id);
          }
        }
        ++CalendarComponent.nextColour;
      }
    }
  }

  private paintCell(cellNumber: number, eventId: number){
    let cell = document.getElementById(String(cellNumber));
    if(cell){
      if(cell.style.backgroundColor != "white"){
        if(cell.innerText == ""){
          cell.innerText = "2";
        }
        else{
          cell.innerText = String(Number(cell.innerText) + 1);
        }
      }
      cell.style.backgroundColor = CalendarComponent.coloursArray[(CalendarComponent.nextColour
                                                                % CalendarComponent.coloursArray.length)];
      cell.setAttribute("value",String(eventId));
    }
  }

  private clearCells(){
    for(let cellNumber = 1; cellNumber <= 72; cellNumber++){
      let cell = document.getElementById(String(cellNumber));
      if(cell){
        cell.style.backgroundColor = 'white';
        cell.removeAttribute("value");
        cell.innerText = "";
        cell.style.color = "white";
      }
    }
  }

  showEventDetails(clickEvent: MouseEvent) {
    if(this.meetingRoomSelected == 100){
      return;
    }
    let clickTarget = clickEvent.target as HTMLElement;
    if (clickTarget.style.backgroundColor == "white" ||
        !clickTarget.getAttribute("value")) {
      this.hideEventDetails();
      return;
    }
    let detailsTr = document.getElementById("eventDetailsTr");
    if (detailsTr) {
      detailsTr.removeAttribute("hidden");
    }
    this.eventService.getEvent(Number(clickTarget.getAttribute("value"))).subscribe(data => {
        this.eventSelected = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }, () => {
        this.meetingRoomService.getMeetingRoom(this.eventSelected.meetingRoom).subscribe(data => {
            this.eventSelectedMeetingRoom = data;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }, () => {
            this.purposeService.getPurpose(this.eventSelected.purpose).subscribe(data => {
                this.eventSelectedPurpose = data;
              },
              (error: HttpErrorResponse) => {
                alert(error.message);
              }, () => {
                let detailsP = document.getElementById("eventDetailsP");
                if (detailsP) {
                  detailsP.innerHTML = "Название: " + this.eventSelected.name + "<br>"
                    + "Время начала события: " + this.dateToLocalString(this.eventSelected.startTime) + "<br>"
                    + "Время конца события: " + this.dateToLocalString(this.eventSelected.endTime) + "<br>"
                    + "Цель события: " + this.eventSelectedPurpose.name + "<br>"
                    + "Место события: " + this.eventSelectedMeetingRoom.name + "<br>"
                    + "Организатор события: " + this.eventSelected.applicant + "<br>"
                    + "Участники события: " + this.eventSelected.participantsList + "<br>"
                    + "Время создания события: " + this.dateToLocalString(this.eventSelected.creationTime);
                }
              })
          })
      }
    );
  }

  private hideEventDetails(){
    let details = document.getElementById("eventDetailsTr");
    if(details){
      details.setAttribute("hidden","true");
    }
  }

  private dateToLocalString(date: Date): String{
    let newDate = new Date(date);
    return newDate.toLocaleString();
  }

  goToEventForm(){
    this.router.navigate(['/event/add'], {queryParams: {eventId: this.eventSelected.id}});
  }

  cancelEvent(){
    if(confirm("Отменить выбранное событие?")) {
      this.eventService.updateEventLastVersion(this.eventSelected.id).subscribe(data => {
          alert("Событие было удалено");
          this.hideEventDetails();
          this.clearCells();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }
  }

}
