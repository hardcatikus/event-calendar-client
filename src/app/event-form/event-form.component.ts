import { Component } from '@angular/core';
import {Event} from "../model/event";
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "../service/event.service";

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {

  event: Event;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {
    this.event = new Event();
  }

  onSubmit(){
    this.eventService.addEvent(this.event).subscribe(result => this.gotoEventList());
  }

  gotoEventList(){
    this.router.navigate(['/rest/event/all']);
  }
}
