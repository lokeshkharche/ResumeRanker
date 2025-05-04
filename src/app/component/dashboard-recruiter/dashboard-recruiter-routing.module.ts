import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileRecruiterComponent } from './profile-recruiter/profile-recruiter/profile-recruiter.component';
import { DashboardRecruiterComponent } from './dashboard-recruiter.component';
import { HiringComponent } from './hiring/hiring/hiring.component';
import { ATSComponent } from './ATS/ats/ats.component';
import { ComposeMailComponent } from './compose-mail/compose-mail/compose-mail.component';
import { HomeComponent } from './home/home/home.component';

const routes: Routes = [
  { path: '', component: DashboardRecruiterComponent, children: [ 
    {path: '', component: HomeComponent}, 
    { path:'profiles', component: ProfileRecruiterComponent },
    { path:'hiring', component: HiringComponent },
    { path:'ATS', component:ATSComponent },
    { path:'compose-mail', component:ComposeMailComponent}
  ]},
//   { path: 'profiles', component: ProfileRecruiterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRecruiterRoutingModule {}