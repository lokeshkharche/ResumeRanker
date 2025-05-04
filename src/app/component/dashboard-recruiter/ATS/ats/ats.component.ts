import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ats',
  templateUrl: './ats.component.html',
  styleUrls: ['./ats.component.css']
})
export class ATSComponent implements OnInit {
  
  jobId: string | null = null;
  applications: any[] = [];
  filteredApplications: any[] = [];
  minMatchPercentage: number = 0;
  filterApplied: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = history.state;
    this.jobId = state.jobId || null;
    this.applications = state.applications || [];

    // Initialize filtered applications to show all applications initially
    this.filteredApplications = [...this.applications];
    
    console.log('Job ID:', this.jobId);
    console.log('Applications:', this.applications);

    // Parse resume summaries if available
    this.applications.forEach(app => {
      if (app.resume_summary) {
        try {
          const resumeSummaryObj = JSON.parse(app.resume_summary);
          app.parsedResumeSummary = resumeSummaryObj.data?.text || '';
        } catch (e) {
          console.error('Error parsing resume summary:', e);
          app.parsedResumeSummary = '';
        }
      }
    });
  }

  filterCandidates(): void {
    this.filterApplied = true;
    this.filteredApplications = this.applications.filter(app => 
      app.overall_match_score >= this.minMatchPercentage
    );
  }

  resetFilter(): void {
    this.filterApplied = false;
    this.minMatchPercentage = 0;
    this.filteredApplications = [...this.applications];
  }

  sendMailToFilteredCandidates() {
    const candidateIds = this.filteredApplications.map(app => app.candidate_id);
    this.router.navigate(['recruiter-dashboard/compose-mail'], {
      state: {
        candidateIds: candidateIds,
        jobId: this.jobId
      }
    });
  }
}