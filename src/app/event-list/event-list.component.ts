import {Component, OnInit} from '@angular/core';
import {Event} from "../model/event";
import {EventService} from "../service/event.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit{

  events!: Event[];

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.getAllEvents().subscribe(data => {
      this.events = data;
    },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}
