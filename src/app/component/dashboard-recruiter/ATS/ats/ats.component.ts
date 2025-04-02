import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from 'src/app/services/job.service';
import { SupaService } from 'src/app/services/supa.service';

interface JobApplication {
  matchPercentage: number;
  // Add other properties if needed
}


@Component({
  selector: 'app-ats',
  templateUrl: './ats.component.html',
  styleUrls: ['./ats.component.css']
})
export class ATSComponent {
    jobs: any[] = [];
    applications: any;
    selectedJobId: string | null = null;
    jobId: string | null = null;
    minMatchPercentage: number = 0;
    jobDescription: any ;
    filteredApplications: any[] = [];

  constructor(private fb: FormBuilder,
    private jobService: JobService, 
  ) {}

  async  ngOnInit() {
    const state = window.history.state;
    this.jobId = state.jobId || null;
    this.applications = state.applications || [];
    console.log("Received job ID:", this.jobId);
    console.log("Received applications:", this.applications);
    console.log("Received applications:", this.applications[0].resume_summary);
    
      await this.getJobDescription();
      await this.getMatchingPercentages();
    
  }

  async getJobDescription() {
    this.jobDescription = await this.jobService.getJobsById(this.jobId!);
     
    console.log("jobDescription:",this.jobDescription[0].description);
  }

  async getMatchingPercentages() {
    for (let application of this.applications) {
      if (application.resume_summary) {  
        const matchPercentage = await this.jobService.getResumeMatch(this.jobDescription[0].description, application.resume_summary);
        application.matchPercentage = matchPercentage;
        console.log(`Match Percentage for application:`, matchPercentage);
      } else {
        console.warn("Skipping application due to missing resume summary.");
        application.matchPercentage = 0;
      }
    }
    this.filterCandidates();
  }
  
  filterCandidates() {
    this.filteredApplications = this.applications.filter((app: JobApplication) => app.matchPercentage >= this.minMatchPercentage);
  }
}