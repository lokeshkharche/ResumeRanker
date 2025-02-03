import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { LoginComponent } from './component/login/login.component';
import { DashboardCandidateComponent } from './component/dashboard-candidate/dashboard-candidate.component';
import { DashboardRecruiterComponent } from './component/dashboard-recruiter/dashboard-recruiter.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Landing page
  { path: 'login', component: LoginComponent }, // Login page
  { path: 'register', component: RegisterComponent }, // Register page
  { path: 'candidate-dashboard', component: DashboardCandidateComponent, canActivate: [AuthGuard] }, 
  { path: 'recruiter-dashboard', component: DashboardRecruiterComponent, canActivate: [AuthGuard] }, 
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
