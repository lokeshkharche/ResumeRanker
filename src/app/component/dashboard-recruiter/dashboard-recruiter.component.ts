import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-dashboard-recruiter',
  templateUrl: './dashboard-recruiter.component.html',
  styleUrls: ['./dashboard-recruiter.component.css']
})
export class DashboardRecruiterComponent {
  currentUser: any;
    isProfileIncomplete: boolean = false;
    constructor(
      private supaService: SupaService,
      private router: Router,
      private toastr: ToastrService,
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
      if (!this.currentUser) return;
  
      const { company_name, phone_number } = this.currentUser.user_metadata;
  
      if (!company_name || !phone_number ) {
        this.isProfileIncomplete = true;
      }
    }
  
    goToProfile() {
      this.isProfileIncomplete = false;
      this.router.navigate(['recruiter-dashboard/profiles']); 
    }

    goToHome() {
      this.isProfileIncomplete = false;
      this.router.navigate(['recruiter-dashboard']); 
    }

    gotoHiring(){
      this.router.navigate(['recruiter-dashboard/hiring']); 
    }
    
    async logout() {
      await this.supaService.signOut();
      this.router.navigate(['/login']); 
    }
  
}