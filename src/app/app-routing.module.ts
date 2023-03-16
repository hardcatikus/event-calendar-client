import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EventListComponent} from "./event-list/event-list.component";
import {EventFormComponent} from "./event-form/event-form.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {AdminComponent} from "./admin/admin.component";

const routes: Routes = [
  {
    path: 'event/all', component: EventListComponent
  },
  {
    path: 'event/add', component: EventFormComponent
  },
  {
    path: 'calendar', component: CalendarComponent
  },
  {
    path: 'admin', component: AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
