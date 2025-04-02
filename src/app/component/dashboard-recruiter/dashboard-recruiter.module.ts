import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { ProfileRecruiterComponent } from './profile-recruiter/profile-recruiter/profile-recruiter.component';
import { DashboardRecruiterComponent } from './dashboard-recruiter.component';
import { DashboardRecruiterRoutingModule } from './dashboard-recruiter-routing.module';
import { RouterModule } from '@angular/router';
import { HiringComponent } from './hiring/hiring/hiring.component';
import { ATSComponent } from './ATS/ats/ats.component';

@NgModule({
  declarations: [
    DashboardRecruiterComponent,
    ProfileRecruiterComponent,
    HiringComponent,
    ATSComponent
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
