import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/profile.service';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-dashboard-candidate',
  templateUrl: './dashboard-candidate.component.html',
  styleUrls: ['./dashboard-candidate.component.css'],
})
export class DashboardCandidateComponent {
  currentUser: any;
  isProfileIncomplete: boolean = false;
  userData: any;
  updatedUserData: any;
  user: any;
  constructor(
    private supaService: SupaService,
    private router: Router,
    private toastr: ToastrService,
    private profileService: ProfileService
  ) {}

  async ngOnInit() {
    try {
      this.currentUser = await this.supaService.getCurrentUser();
      console.log('Logged in user:', this.currentUser);
      console.log(this.currentUser.user_metadata);
      if (this.currentUser) {
        await this.supaService.saveUserData(this.currentUser);
        console.log('User data saved successfully!');
      }
      this.checkProfileCompletion();
      this.loadCandidateDetails();
    } catch (error) {
      console.error('Error retrieving or saving user data:', error);
    }
  }

  checkProfileCompletion() {
    // First check if user and user_metadata exist
    if (!this.currentUser || !this.currentUser.user_metadata) {
      this.isProfileIncomplete = true; // If we don't have user data, profile is incomplete
      return;
    }
    
    const { phone_number, skills } = this.currentUser.user_metadata;
    
    this.isProfileIncomplete = !phone_number || !skills || phone_number.trim() === '' || (Array.isArray(skills) && skills.length === 0);
    
    console.log("Profile incomplete:", this.isProfileIncomplete);
  }


  async loadCandidateDetails() {
    this.user = await this.supaService.getCurrentUser();
    if (this.user) {
      this.userData = await this.profileService.getCandidateDetails(this.user.id);
      console.log("Raw Data from Supabase:", this.userData);
  
      if (!this.userData || Object.keys(this.userData).length === 0) {
        console.error("Error: No user data found or empty object.");
        return;
      }
  
      this.updatedUserData = { ...this.userData }; 
      console.log("Copied Data for Editing:", this.updatedUserData);
    }
  }
  // getProfileDetails(){
  //   this.currentUser = this.supaService.getCurrentUser();
  //   console.log("Profileee....:",this.currentUser);
  // }

  goToProfile() {
    this.router.navigate(['candidate-dashboard/profile']);
  }
  goToCompanies(){
    this.router.navigate(['candidate-dashboard/company']);
  }
  goToHome(){
    this.router.navigate(['candidate-dashboard/']);
  }

  async logout() {
    await this.supaService.signOut();
    this.router.navigate(['/login']);
  }

  goToJob() {
    this.router.navigate(['candidate-dashboard/job']);
  }
}
