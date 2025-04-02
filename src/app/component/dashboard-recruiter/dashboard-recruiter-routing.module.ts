import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileRecruiterComponent } from './profile-recruiter/profile-recruiter/profile-recruiter.component';
import { DashboardRecruiterComponent } from './dashboard-recruiter.component';
import { HiringComponent } from './hiring/hiring/hiring.component';
import { ATSComponent } from './ATS/ats/ats.component';

const routes: Routes = [
  { path: '', component: DashboardRecruiterComponent, children: [  
    { path:'profiles', component: ProfileRecruiterComponent },
    { path:'hiring', component: HiringComponent },
    { path:'ATS', component:ATSComponent }
  ]},
//   { path: 'profiles', component: ProfileRecruiterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRecruiterRoutingModule {}