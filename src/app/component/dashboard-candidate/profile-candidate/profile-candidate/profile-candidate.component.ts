import { Component } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-profile-candidate',
  templateUrl: './profile-candidate.component.html',
  styleUrls: ['./profile-candidate.component.css']
})
export class ProfileCandidateComponent {
  currentUser: any;
  userData: any;
  isEditing = false;
  updatedUserData: any = {}; 
  selectedFile: File | null = null;
  uploading: boolean = false;

  constructor(
    private supaService: SupaService,
    private profileService: ProfileService
  ) {}

  async ngOnInit() {
    await this.loadCandidateDetails();
  }

  async loadCandidateDetails() {
    this.currentUser = await this.supaService.getCurrentUser();
    if (this.currentUser) {
      this.userData = await this.profileService.getCandidateDetails(this.currentUser.id);
      console.log("Raw Data from Supabase:", this.userData);
  
      if (!this.userData || Object.keys(this.userData).length === 0) {
        console.error("Error: No user data found or empty object.");
        return;
      }
  
      this.updatedUserData = { ...this.userData }; 
      console.log("Copied Data for Editing:", this.updatedUserData);
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.updatedUserData = { ...this.userData }; 
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      console.log("Selected file:", file);
    } else {
      alert("Please select a valid PDF file.");
      this.selectedFile = null;
    }
  }

  async uploadResume() {
    if (!this.selectedFile || !this.currentUser) return;
  
    const uploadedFileUrl = await this.profileService.uploadFile(this.currentUser.id, this.selectedFile);
  
    if (uploadedFileUrl) {
      console.log("Resume uploaded successfully:", uploadedFileUrl);
      this.updatedUserData.resume_url = uploadedFileUrl;
    } else {
      console.error("Failed to upload resume.");
    }
  }
  
  getResumeUrl(): string | null {
    return this.updatedUserData?.resume_url || null;
  }
  

  async saveChanges() {
    if (!this.currentUser || !this.updatedUserData) return;
  
    if (this.selectedFile) {
      await this.uploadResume(); 
    }

    console.log("Updating candidate details:", this.updatedUserData);
  
    const updatedUser = await this.profileService.updateCandidateDetails(this.currentUser.id, this.updatedUserData);
  
    if (updatedUser) {
      console.log("Profile updated successfully!", updatedUser);
      this.userData = { ...updatedUser };
      this.isEditing = false;
      this.selectedFile = null; 
    } else {
      console.error("Failed to update candidate details");
    }
  }
}
