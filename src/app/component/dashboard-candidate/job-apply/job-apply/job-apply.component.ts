import { Component } from '@angular/core';
import { JobService } from 'src/app/services/job.service';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-job-apply',
  templateUrl: './job-apply.component.html',
  styleUrls: ['./job-apply.component.css']
})
export class JobApplyComponent {
  
    jobs: any[] = [];
    showForm: boolean = false;

  constructor( private jobService: JobService, private supabase: SupaService) {
      this.getJobs();
      
    }

    async getJobs() {
      try {
        const user = await this.supabase.getCurrentUser();
        const candidateId = user?.id;
    
        if (!candidateId) {
          alert("You must be logged in as a candidate.");
          return;
        }
    
        const jobs = await this.jobService.getAllJobs();
        const applications = await this.jobService.getApplicationsForCandidate(candidateId);
    
        this.jobs = jobs.map(job => ({
          ...job,
          hasApplied: applications.some(app => app.job_id === job.id)
        }));
    
        console.log("Fetched jobs:", this.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    }
    

  async applyForJob(jobId: string, event: any) {
    const user = await this.supabase.getCurrentUser();
    const candidateId = user?.id;
  
    if (!candidateId) {
      alert("You must be logged in as a candidate to apply.");
      return;
    }
  
    const useDefaultResume = event.target.querySelector('input[name="defaultResume"]').checked;
    const fileInput = event.target.querySelector('input[type="file"]');
    const resumeFile = fileInput.files.length ? fileInput.files[0] : null;
  
    try {
      await this.jobService.applyForJob(jobId, candidateId, useDefaultResume, resumeFile);
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  }
  
  
}
