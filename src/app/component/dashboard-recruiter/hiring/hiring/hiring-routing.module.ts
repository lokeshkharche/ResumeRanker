import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRecruiterComponent } from '../../dashboard-recruiter.component';
import { HiringComponent } from './hiring.component';
import { ATSComponent } from '../../ATS/ats/ats.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardRecruiterComponent, // Main recruiter dashboard
    children: [
      { path: 'hiring', component: HiringComponent },
      { path: 'ATS', component: ATSComponent }, // Route for ATS page
      { path: '', redirectTo: 'hiring', pathMatch: 'full' } // Default child route
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecruiterRoutingModule { }
