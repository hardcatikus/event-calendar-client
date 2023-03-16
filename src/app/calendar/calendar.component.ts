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
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {

  meetingRoomSelected: number;
  dateSelected: string;
  cellSelectedTime: string;
  eventSelected!: Event;
  events!: Event [];
  meetingRooms!: MeetingRoom [];
  detailsList: string [] = [];
  eventSelectedIdList: number [] = [];
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
    this.cellSelectedTime = "08:00";
    this.meetingRoomSelected = 100;
    this.dateSelected = this.dateToString(new Date());
  }

  ngOnInit() {
    this.getMeetingRoomsFromDB();
    this.hideEventDetails();
    this.fillCalendar();
  }

  fillCalendar(){
    this.detailsList = [];
    this.eventSelectedIdList = [];
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
        cell.setAttribute("value",cell.getAttribute("value")
          + "," + String(eventId));
        if(cell.innerText == ""){
          cell.innerText = "2";
        }
        else{
          cell.innerText = String(Number(cell.innerText) + 1);
        }
      }
      else{
        cell.setAttribute("value",String(eventId));
      }
      cell.style.backgroundColor = CalendarComponent.coloursArray[(CalendarComponent.nextColour
                                                                % CalendarComponent.coloursArray.length)];
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
    this.detailsList = [];
    this.eventSelectedIdList = [];
    let clickTarget = clickEvent.target as HTMLElement;
    this.cellSelectedTime = this.getCellTime(Number(clickTarget.id));
    if (clickTarget.style.backgroundColor == "white" ||
        !clickTarget.getAttribute("value")) {
      this.hideEventDetails();
      this.goToEventFormWithTime();
      return;
    }
    let detailsTr = document.getElementById("bottomButtonTr");
    if (detailsTr) {
      detailsTr.removeAttribute("hidden");
    }
    // @ts-ignore
    this.eventSelectedIdList = clickTarget.getAttribute("value").split(',').map(Number);
    this.fillEventDetails(this.eventSelectedIdList,0);
  }

  private fillEventDetails(eventIDArray: number[], index: number){
    let eventID: number = eventIDArray[index];
    this.eventService.getEvent(eventID).subscribe(data => {
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
                let detailsString: string;
                detailsString = "Название: " + this.eventSelected.name + "<br>"
                  + "Время начала события: " + this.dateToLocalString(this.eventSelected.startTime) + "<br>"
                  + "Время конца события: " + this.dateToLocalString(this.eventSelected.endTime) + "<br>"
                  + "Цель события: " + this.eventSelectedPurpose.name + "<br>"
                  + "Место события: " + this.eventSelectedMeetingRoom.name + "<br>"
                  + "Организатор события: " + this.eventSelected.applicant + "<br>"
                  + "Участники события: " + this.eventSelected.participantsList + "<br>"
                  + "Время создания события: " + this.dateToLocalString(this.eventSelected.creationTime);
                this.detailsList.push(detailsString);
                ++index;
                if (index < eventIDArray.length) {
                  this.fillEventDetails(eventIDArray, index);
                }
              })
          })
      }
    );
  }

  identify(index: number, item: string){
    return item;
  }

  private hideEventDetails(){
    let details = document.getElementById("bottomButtonTr");
    if(details){
      details.setAttribute("hidden","true");
    }
  }

  private dateToLocalString(date: Date): String{
    let newDate = new Date(date);
    return newDate.toLocaleString();
  }

  goToEventFormWithId(indexId: number){
    this.router.navigate(['/event/add'],
      {queryParams: {eventId: this.eventSelectedIdList[indexId]}});
  }

  goToEventFormWithTime(){
    let startDate: string;
    startDate = this.dateSelected + "T" + this.cellSelectedTime;
    this.router.navigate(['/event/add'], {queryParams: {startDate: startDate}});
  }

  goToEventFormWithDefaultTime(){
    let startDate: string;
    startDate = this.dateSelected + "T08:00";
    this.router.navigate(['/event/add'], {queryParams: {startDate: startDate}});
  }

  private getCellTime(cellId: number): string{
    let cellHours: string;
    let cellMinutes: string;
    if(cellId % 6 != 0){
      cellMinutes = (cellId % 6 - 1) + "0";
      cellHours = String(Math.floor(cellId / 6) + 8);
    }
    else {
      cellMinutes = "50";
      cellHours = String(Math.floor(cellId / 6) + 7);
    }
    if(cellHours.length == 1) {
      cellHours = "0" + cellHours;
    }
    return cellHours + ":" + cellMinutes;
  }

  cancelEvent(indexId: number){
    if(confirm("Отменить выбранное событие?")) {
      this.eventService.updateEventLastVersion(this.eventSelectedIdList[indexId]).subscribe(data => {
          alert("Событие было удалено");
          this.hideEventDetails();
          this.clearCells();
          this.fillCalendar();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }
  }

  private dateToString(date: Date): string {
    let result: string;
    result = new Date(date).toISOString().substring(0, 10);
    return result;
  }

  changeDatePreviousDay(){
    let changedDate: Date = new Date(this.dateSelected);
    changedDate.setDate(changedDate.getDate() - 1);
    this.dateSelected = this.dateToString(changedDate);
    this.fillCalendar();
  }

  changeDateNextDay(){
    let changedDate: Date = new Date(this.dateSelected);
    changedDate.setDate(changedDate.getDate() + 1);
    this.dateSelected = this.dateToString(changedDate);
    this.fillCalendar();
  }

}
