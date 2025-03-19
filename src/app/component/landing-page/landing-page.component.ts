import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  constructor(private router: Router) {}

  goToLogin() {
    console.log('Navigating to login...');
    this.router.navigate(['/login']).catch(err => console.error('Navigation error:', err));
  }
  

  goToRegister() {
    this.router.navigate(['/register']);
  }


  showModal(userType: string): void {
    const modalTitle = userType === 'job-seeker' ? 'Job Seeker Login' : 'Recruiter Login';
    alert(modalTitle); // Replace with actual modal logic
  }
}