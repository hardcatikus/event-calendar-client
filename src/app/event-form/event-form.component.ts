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
    this.fillMeetingRoomList();
    this.fillPurposeList();
  }

  private fillMeetingRoomList(){
    this.event.meetingRoom = 0;
    this.meetingRoomService.getAllMeetingRooms().subscribe(data => {
        this.meetingRooms = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private fillPurposeList(){
    this.event.purpose = 0;
    this.purposeService.getAllPurposes().subscribe(data => {
        this.purposes = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onSubmit(){
    let result: boolean = false;
    let stringDate: string = this.event.startTime.getFullYear() + "-" +
      (this.event.startTime.getMonth() + 1)  + "-" + this.event.startTime.getDate();
    let events: Event[];
    this.eventService.getAllEventsByMeetingRoomAndDate(this.event.meetingRoom,
      stringDate).subscribe(data => {
        events = data;
        for(let eventNumber = 0; eventNumber < events.length; eventNumber++){
          if(this.event.id == events[eventNumber].id){
            continue;
          }
          else {
            let endTimeWithMoreMinutes = new Date(events[eventNumber].endTime);
            endTimeWithMoreMinutes.setMinutes(endTimeWithMoreMinutes.getMinutes() - 10);
            endTimeWithMoreMinutes.setHours(endTimeWithMoreMinutes.getHours() - 3);
            let startTimeWithMoreMinutes = new Date(events[eventNumber].startTime);
            startTimeWithMoreMinutes.setMinutes(startTimeWithMoreMinutes.getMinutes() + 10);
            startTimeWithMoreMinutes.setHours(startTimeWithMoreMinutes.getHours() - 3);
            console.log("end " + endTimeWithMoreMinutes + "<=" + this.event.startTime);
            console.log("start " + startTimeWithMoreMinutes + ">=" + this.event.endTime);
            if((endTimeWithMoreMinutes <= this.event.startTime) ||
              (startTimeWithMoreMinutes >= this.event.endTime)){
              continue;
            }
            else{
              result = true;
            }
          }
        }
        if(result){
          alert("Выбранное время проведения события уже занято!")
          return;
        }
        else{
          this.addNewEvent();
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
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
      this.endTimeChange();
      this.startTimeChange();
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

  checkOtherPurpose() {
    if(this.event.purpose == 100) {
      let element = document.getElementById("new-purpose-text");
      if(element){
        element.removeAttribute("hidden");
      }
      element = document.getElementById("new-purpose-button");
      if(element){
        element.removeAttribute("hidden");
        element.setAttribute("disabled","true");
      }
    }
    else {
      let element = document.getElementById("new-purpose-text");
      if(element){
        element.setAttribute("hidden","true");
      }
      element = document.getElementById("new-purpose-button");
      if(element){
        element.setAttribute("hidden","true");
      }
    }
  }

  checkNewPurposeContent() {
    let element = document.getElementById("new-purpose-text");
    if(element){
      if((element as HTMLInputElement).value.trim() == "") {
        element = document.getElementById("new-purpose-button");
        if(element){
          element.setAttribute("disabled","true");
        }
      }
      else {
        element = document.getElementById("new-purpose-button");
        if(element){
          element.removeAttribute("disabled");
        }
      }
    }
  }

  createNewPurpose() {
    let newPurpose = new Purpose();
    newPurpose.id = 0;
    let element = document.getElementById("new-purpose-text");
    if(element) {
      newPurpose.name = (element as HTMLInputElement).value.trim();
    }
    for(let i = 0; i < this.purposes.length; i++){
      if(newPurpose.name == this.purposes[i].name){
        alert("Цель с таким именем уже существует!");
        return;
      }
    }
    this.purposeService.addPurpose(newPurpose).subscribe(result => {
      this.fillPurposeList();
      alert("Новая цель добавлена");
    },(error: HttpErrorResponse) => {
        alert(error.message);
      });
  }

  checkOtherMeetingRoom() {
    if(this.event.meetingRoom == 100) {
      let element = document.getElementById("new-room-text");
      if(element){
        element.removeAttribute("hidden");
      }
      element = document.getElementById("new-room-button");
      if(element){
        element.removeAttribute("hidden");
        element.setAttribute("disabled","true");
      }
    }
    else {
      let element = document.getElementById("new-room-text");
      if(element){
        element.setAttribute("hidden","true");
      }
      element = document.getElementById("new-room-button");
      if(element){
        element.setAttribute("hidden","true");
      }
    }
  }

  checkNewMeetingRoomContent() {
    let element = document.getElementById("new-room-text");
    if(element){
      if((element as HTMLInputElement).value.trim() == "") {
        element = document.getElementById("new-room-button");
        if(element){
          element.setAttribute("disabled","true");
        }
      }
      else {
        element = document.getElementById("new-room-button");
        if(element){
          element.removeAttribute("disabled");
        }
      }
    }
  }

  createNewMeetingRoom() {
    let newMeetingRoom = new MeetingRoom();
    newMeetingRoom.id = 0;
    let element = document.getElementById("new-room-text");
    if(element) {
      newMeetingRoom.name = (element as HTMLInputElement).value.trim();
    }
    for(let i = 0; i < this.meetingRooms.length; i++){
      if(newMeetingRoom.name == this.meetingRooms[i].name){
        alert("Место с таким именем уже существует!");
        return;
      }
    }
    this.meetingRoomService.addMeetingRoom(newMeetingRoom).subscribe(result => {
      this.fillMeetingRoomList();
      alert("Новое место добавлено");
    },(error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  checkStartTime(): boolean{
    let result: boolean = false;
    try {
      result = this.event.startTime.getHours() < 8;
    }
    catch (e: any) {
      return result;
    }
    return result;
  }

  checkEndTime(): boolean{
    let result: boolean = false;
    try {
      result = (this.event.endTime.getHours() > 20) ||
        ((this.event.endTime.getHours() == 20) && (this.event.endTime.getMinutes() > 0));
    }
    catch (e: any) {
      return result;
    }
    return result;
  }

  checkOneDay(): boolean {
    let result: boolean = false;
    try{
      result = this.event.startTime.getDate() != this.event.endTime.getDate();
    }
    catch (e: any){
      return result;
    }
    return result;
  }

  private addNewEvent(){
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
      this.event.initialState = 0;
    }
    this.event.creationTime = this.addThreeHours(new Date());
    this.event.startTime = this.addThreeHours(this.event.startTime);
    this.event.endTime = this.addThreeHours(this.event.endTime);
    this.event.id = 0;
    this.event.name =this.event.name.trim();
    this.event.applicant = this.event.applicant.trim();
    this.event.participantsList = this.event.participantsList.trim();
    this.eventService.addEvent(this.event).subscribe(result => {
      this.gotoCalendar();
      if (this.formOfChanges) {
        alert("Событие было обновлено");
      }
      else{
        alert("Событие было добавлено");
      }
    },(error: HttpErrorResponse) => {
      alert(error.message);
    });
  }

  checkName(): boolean {
    try{
      return this.event.name.trim() == "";
    }
    catch {
      return true;
    }
  }

  checkApplicant(): boolean {
    try{
      return this.event.applicant.trim() == "";
    }
    catch {
      return true;
    }
  }

  checkParticipantsList(): boolean {
    try{
      return this.event.participantsList.trim() == "";
    }
    catch {
      return true;
    }
  }

  checkMeetingRoom(): boolean {
    return this.event.meetingRoom == 0 || this.event.meetingRoom == 100;
  }

  checkPurpose(): boolean {
    return this.event.purpose == 0 || this.event.purpose == 100;
  }

  checkEndTimeUsed(): boolean {
    if (!this.endTimeString){
      return true;
    }
    else {
      return this.endTimeString == "";
    }
  }

  checkStartTimeUsed(): boolean {
    if (!this.startTimeString){
      return true;
    }
    else {
      return this.startTimeString == "";
    }
  }

  checkAllFields(): boolean {
     return  this.compareDates() || this.checkStartTime() || this.checkEndTime()
       || this.checkOneDay() || this.checkName() || this.checkApplicant() || this.checkParticipantsList()
       || this.checkMeetingRoom() || this.checkPurpose() || this.checkStartTimeUsed() || this.checkEndTimeUsed();
  }

}
