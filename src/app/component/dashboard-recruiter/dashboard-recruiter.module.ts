import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { ProfileRecruiterComponent } from './profile-recruiter/profile-recruiter/profile-recruiter.component';
import { DashboardRecruiterComponent } from './dashboard-recruiter.component';
import { DashboardRecruiterRoutingModule } from './dashboard-recruiter-routing.module';
import { RouterModule } from '@angular/router';
import { HiringComponent } from './hiring/hiring/hiring.component';
import { ATSComponent } from './ATS/ats/ats.component';
import { ComposeMailComponent } from './compose-mail/compose-mail/compose-mail.component';
import { HomeComponent } from './home/home/home.component';

@NgModule({
  declarations: [
    DashboardRecruiterComponent,
    ProfileRecruiterComponent,
    HiringComponent,
    ATSComponent,
    ComposeMailComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    DashboardRecruiterRoutingModule
  ],
  exports: [DashboardRecruiterComponent]
})
export class DashboardRecruiterModule { }
