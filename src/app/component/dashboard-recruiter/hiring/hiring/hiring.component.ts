import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from 'src/app/services/job.service';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-hiring',
  templateUrl: './hiring.component.html',
  styleUrls: ['./hiring.component.css']
})
export class HiringComponent {
  jobForm: FormGroup;
  jobs: any[] = [];
  showForm: boolean = false;
  applications: any[] = [];
  selectedJobId: string | null = null;
  showApplicationsModal: boolean = false;

  constructor(private fb: FormBuilder,
      private jobService: JobService,
      private supabase: SupaService,
      private router: Router, 
    ) {
    this.getJobs();
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: [''],
      salary: ['']
    });
  }

  async submitJob() {
    if (this.jobForm.valid) {
      try {
        const user = await this.supabase.getCurrentUser();  
        console.log("User retrieved:", user);
  
        if (!user || !user.id) {
          console.error("Recruiter not found!");
          return;
        }
  
        const recruiterId = user.id;
        console.log("Recruiter ID:", recruiterId);
  
        const jobData = { ...this.jobForm.value, recruiter_id: recruiterId };
  
        await this.jobService.addJob(jobData);
        alert("Job posted successfully!");
        this.jobForm.reset();
  
      } catch (error) {
        console.error("Error posting job:", error);
      }
    }
  }

  async getJobs() {
    try {
      const user = await this.supabase.getCurrentUser();
      const recruiterId = user?.id;

      if (!recruiterId) {
        alert("You must be logged in as a recruiter.");
        return;
      }

      this.jobs = await this.jobService.getJobsByRecruiter(recruiterId);
      console.log("Fetched jobs:", this.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  async viewApplications(jobId: string) {
    try {
      this.selectedJobId = jobId;
      this.applications = await this.jobService.getApplicationsForJob(jobId);
      console.log("This Applications :",this.applications);
      this.showApplicationsModal = true;
      console.log("Application :",this.applications[0].candidate);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  }

  async goToATS(){
    this.router.navigate(['recruiter-dashboard/ATS'], {
      state: { jobId: this.selectedJobId, applications: this.applications }
    });
  }

  closeApplicationsModal() {
    this.showApplicationsModal = false;
    this.selectedJobId = null;
    this.applications = [];
  }

  

  async getRecruiterJobs() {
    const user = await this.supabase.getCurrentUser();  
    const recruiterId = user?.id;  
  
    if (!recruiterId) {
      console.error("Recruiter ID not found!");
      return;
    }
  
    try {
      this.jobs = await this.jobService.getJobsByRecruiterId(recruiterId);
      console.log("Jobs for recruiter:", this.jobs);
    } catch (error) {
      console.error("Error fetching recruiter jobs:", error);
    }
  }
  

  toggleForm() {
    this.showForm = !this.showForm;
  }
  
  
}
