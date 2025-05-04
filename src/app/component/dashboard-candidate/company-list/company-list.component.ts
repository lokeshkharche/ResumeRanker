import { Component } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { JobService } from 'src/app/services/job.service';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent {
  companies: any;
  selectedCompany: any = null;   
  jobs: any[] = [];  
  showForm: boolean = false;
  selectedJob: any = null;

  constructor(
    private profileService: ProfileService,
    private jobService: JobService,
    private supabase: SupaService
  ) {}

  async ngOnInit() {
    await this.getCompany();
  }

  async getCompany() {
    const companyData = await this.profileService.getCompany();
    console.log("Company List: ", companyData);
    this.companies = companyData;
  }

  async onSelectCompany(company: any) {
    this.selectedCompany = company;
    await this.getJobsByCompany(company.id);
  }

  async getJobsByCompany(companyId: string) {
    try {
      this.jobs = await this.jobService.getJobsByRecruiterId(companyId);
      console.log("Jobs for company", companyId, this.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }

  async applyForJob(jobId: string, event: any) {
    event.preventDefault();
    const user = await this.supabase.getCurrentUser();
    const candidateId = user?.id;
  
    if (!candidateId) {
      alert("You must be logged in as a candidate to apply.");
      return;
    }
  
    console.log("Trying to apply for Job ID:", jobId);
  
    const alreadyApplied = this.jobs.find(job => job.id === jobId)?.hasApplied;
    console.log("Already applied?", alreadyApplied); 
  
    if (alreadyApplied) {
      alert("You have already applied for this job.");
      return;
    }
    
    let useDefaultResume, resumeFile;

    // Handle both cases: form submission from modal or card
    if (event.target) {
      // Form element was passed
      useDefaultResume = event.target.querySelector('input[name="defaultResume"]')?.checked;
      const fileInput = event.target.querySelector('input[type="file"]');
      resumeFile = fileInput?.files?.length ? fileInput.files[0] : null;
    } else {
      // Direct event from modal button
      useDefaultResume = true; // Default to using default resume when applying from modal
      resumeFile = null;
    }
  
    try {
      await this.jobService.applyForJob(jobId, candidateId, useDefaultResume, resumeFile);
  
      this.jobs = this.jobs.map(job =>
        job.id === jobId ? { ...job, hasApplied: true } : job
      );
  
      console.log("Application submitted successfully for:", jobId);
      alert("Application submitted successfully!");
      
      // Close modal if it was open
      if (this.selectedJob) {
        this.closeJobDetails();
      }
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  }

  openJobDetails(job: any): void {
    this.selectedJob = job;
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeJobDetails(): void {
    this.selectedJob = null;
    
    document.body.style.overflow = 'auto';
  }
}
