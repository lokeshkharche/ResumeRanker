import { Component } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-profile-recruiter',
  templateUrl: './profile-recruiter.component.html',
  styleUrls: ['./profile-recruiter.component.css']
})
export class ProfileRecruiterComponent {
  currentUser: any;
  userData: any;
  updatedUserData: any = {};
  selectedFile: File | null = null;

  constructor(
    private supaService: SupaService,
    private profileService: ProfileService
  ) {}

  async ngOnInit() {
    await this.loadRecruiterDetails();
  }

  async loadRecruiterDetails() {
    this.currentUser = await this.supaService.getCurrentUser();
    if (this.currentUser) {
      this.userData = await this.profileService.getRecruiterDetails(this.currentUser.id);
      console.log("Recruiter Data from Supabase:", this.userData);
  
      if (!this.userData || Object.keys(this.userData).length === 0) {
        console.error("Error: No recruiter data found.");
        return;
      }
  
      this.updatedUserData = { ...this.userData };
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log("Selected file:", file);
    } else {
      alert("Please select a valid image file.");
      this.selectedFile = null;
    }
  }

  async uploadLogo() {
    if (!this.selectedFile || !this.currentUser) return;
  
    const uploadedFileUrl = await this.profileService.uploadCompanyLogo(this.currentUser.id, this.selectedFile);
  
    if (uploadedFileUrl) {
      console.log("Logo uploaded successfully:", uploadedFileUrl);
      this.updatedUserData.company_logo_url = uploadedFileUrl;
    } else {
      console.error("Failed to upload company logo.");
    }
  }

  getLogoUrl(): string | null {
    return this.updatedUserData?.company_logo_url || null;
  }

  async saveChanges() {
    if (!this.currentUser || !this.updatedUserData) return;
  
    if (this.selectedFile) {
      await this.uploadLogo(); 
    }

    console.log("Updating recruiter details:", this.updatedUserData);
  
    const updatedUser = await this.profileService.updateRecruiterDetails(this.currentUser.id, this.updatedUserData);
  
    if (updatedUser) {
      console.log("Profile updated successfully!", updatedUser);
      this.userData = { ...updatedUser };
    } else {
      console.error("Failed to update recruiter details");
    }
  }
}
