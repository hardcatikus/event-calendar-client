import {Component, OnInit} from '@angular/core';
import {EventService} from "../service/event.service";
import {HttpErrorResponse} from "@angular/common/http";
import {EventDTO} from "../dto/event-dto";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit{

  events!: EventDTO[];

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.getAllRelevantEvents().subscribe(data => {
      this.events = data;
    },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  getEventDate(event:EventDTO): string{
    let result: string = '';
    result = event.startTime + "-" + event.endTime.substring(12,17);
    return result;
  }

}
