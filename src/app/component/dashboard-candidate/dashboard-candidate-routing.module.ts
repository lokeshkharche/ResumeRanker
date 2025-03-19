import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileCandidateComponent } from './profile-candidate/profile-candidate/profile-candidate.component';
import { DashboardCandidateComponent } from './dashboard-candidate.component';
import { JobApplyComponent } from './job-apply/job-apply/job-apply.component';

const routes: Routes = [
  { path: '', component: DashboardCandidateComponent, children: [  
    { path: 'profile', component: ProfileCandidateComponent },
    { path: 'job', component: JobApplyComponent }
  ]},
  { path: 'profile', component: ProfileCandidateComponent },
  { path: 'job', component: JobApplyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardCandidateRoutingModule {}