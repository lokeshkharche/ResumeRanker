import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent }, 
  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent }, 
  
  {
    path: 'candidate-dashboard',
    loadChildren: () => import('./component/dashboard-candidate/dashboard-candidate.module')
      .then(m => m.DashboardCandidateModule),
    canActivate: [AuthGuard],
    data: { role: 'candidate' }
  },    
  { 
    path: 'recruiter-dashboard', 
    loadChildren: () => import('./component/dashboard-recruiter/dashboard-recruiter.module')
      .then(m => m.DashboardRecruiterModule), 
    canActivate: [AuthGuard], 
    data: { role: 'recruiter' } 
  }, 
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
