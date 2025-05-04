import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { DashboardCandidateRoutingModule } from './dashboard-candidate-routing.module'; 
import { DashboardCandidateComponent } from './dashboard-candidate.component';
import { ProfileCandidateComponent } from './profile-candidate/profile-candidate/profile-candidate.component';
import { JobApplyComponent } from './job-apply/job-apply/job-apply.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    DashboardCandidateComponent,
    ProfileCandidateComponent,
    JobApplyComponent,
    CompanyListComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardCandidateRoutingModule
  ]
})
export class DashboardCandidateModule { }
