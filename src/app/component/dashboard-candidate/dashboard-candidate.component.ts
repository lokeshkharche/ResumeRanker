import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-dashboard-candidate',
  templateUrl: './dashboard-candidate.component.html',
  styleUrls: ['./dashboard-candidate.component.css'],
})
export class DashboardCandidateComponent {
  currentUser: any;
  isProfileIncomplete: boolean = false;

  constructor(
    private supaService: SupaService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    try {
      this.currentUser = await this.supaService.getCurrentUser();
      console.log('Logged in user:', this.currentUser);

      if (this.currentUser) {
        await this.supaService.saveUserData(this.currentUser);
        console.log('User data saved successfully!');
      }
      this.checkProfileCompletion();
    } catch (error) {
      console.error('Error retrieving or saving user data:', error);
    }
  }

  checkProfileCompletion() {
    if (!this.currentUser || !this.currentUser.user_metadata) {
      this.isProfileIncomplete = true;
      return;
    }

    const { phone_number, skills } = this.currentUser.user_metadata;
    this.isProfileIncomplete = !phone_number || !skills || skills.length === 0;
  }

  goToProfile() {
    this.router.navigate(['candidate-dashboard/profile']);
  }

  async logout() {
    await this.supaService.signOut();
    this.router.navigate(['/login']);
  }

  goToJob() {
    this.router.navigate(['candidate-dashboard/job']);
  }
}
