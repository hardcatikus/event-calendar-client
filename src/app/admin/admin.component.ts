import { Component } from '@angular/core';
import {EventService} from "../service/event.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MeetingRoomService} from "../service/meeting-room.service";
import {MeetingRoom} from "../model/meeting-room";
import {Purpose} from "../model/purpose";
import {PurposeService} from "../service/purpose.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  meetingRoomSelectedId!: number;
  purposeSelectedId!: number;
  meetingRooms!: MeetingRoom [];
  purposes!: Purpose [];

  constructor(private eventService: EventService,
              private meetingRoomService: MeetingRoomService,
              private purposeService: PurposeService) {
  }

  ngOnInit() {
    this.fillMeetingRoomList();
    this.checkNewMeetingRoomContent();
    this.fillPurposeList();
    this.checkNewPurposeContent();
  }

  deleteObsoleteData(){
    if(confirm("Удалить устаревшие события?")) {
      this.eventService.deleteObsoleteEvents().subscribe(data => {
          alert("Устаревшие события были удалены");
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }
  }

  deleteMeetingRoom(){
    if(confirm("Удалить выбранное место событий?")) {
      this.meetingRoomService.deleteMeetingRoom(this.meetingRoomSelectedId).subscribe(data => {
          alert("Место событий было удалено");
          this.fillMeetingRoomList();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }
  }

  deletePurpose(){
    if(confirm("Удалить выбранную цель событий?")) {
      this.purposeService.deletePurpose(this.purposeSelectedId).subscribe(data => {
          alert("Цель событий была удалена");
          this.fillPurposeList();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        });
    }
  }

  private fillMeetingRoomList(){
    this.meetingRoomSelectedId = 0;
    this.meetingRoomService.getAllMeetingRooms().subscribe(data => {
        this.meetingRooms = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private fillPurposeList(){
    this.purposeSelectedId = 0;
    this.purposeService.getAllPurposes().subscribe(data => {
        this.purposes = data;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  checkMeetingRoomSelectedId(): boolean{
    return (this.meetingRoomSelectedId == 0);
  }

  checkPurposeSelectedId(): boolean{
    return (this.purposeSelectedId == 0);
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

}
