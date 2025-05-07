import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class JobService {
   private supabase_client: SupabaseClient;
   resumeSummary: any;
   jobDescription: any;
   ResumeATS: any;
   overallMatchScore: any;
   technicalSkillsMatch: any;
   experienceMatch: any;
   educationMatch: any;
   missingSkills: any;
   matchingSkills: any;

  constructor() {
    this.supabase_client = createClient('https://bosbuvwxrcskbqlpckpu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc2J1dnd4cmNza2JxbHBja3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMjc1MjksImV4cCI6MjA1MzgwMzUyOX0.Etdq-sNv4UAhYFJDU4Wsz3x2L64ZEQqS-wuum25ATUE',{
            auth: {
              persistSession: true,
              autoRefreshToken: true,
              storage: localStorage
            }
          });
  }

  async addJob(jobData: any): Promise<any> {
    try {
      const { data, error } = await this.supabase_client
        .from('jobs')
        .insert([jobData]);

      if (error) {
        console.error("Supabase insert error:", error.message);
        throw new Error(error.message);
      }
      return data;
    } catch (err) {
      console.error("JobService Error:", err);
      throw err;
    }
  }

  async getAllJobs(): Promise<any[]> {
    const { data, error } = await this.supabase_client
      .from('jobs')
      .select('*'); 
  
    if (error) {
      console.error("Error fetching jobs:", error.message);
      return [];
    }
    return data;
  }
  
  async getJobsByRecruiterId(recruiterId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase_client
        .from('jobs')
        .select('*')
        .eq('recruiter_id', recruiterId); 
  
      if (error) {
        console.error("Error fetching jobs for recruiter:", error.message);
        return [];
      }
  
      return data;
    } catch (err) {
      console.error("JobService Error:", err);
      throw err;
    }
  }

  async getApplicationsForCandidate(candidateId: string): Promise<any[]> {
    const { data, error } = await this.supabase_client
      .from('job_applications')
      .select('job_id')
      .eq('candidate_id', candidateId);
  
    if (error) {
      console.error("Error fetching candidate applications:", error.message);
      return [];
    }
    
    return data;
  }

  
  async applyForJob(jobId: string, candidateId: string, useDefaultResume: boolean, resumeFile: File | null) {
    
    const { data: existingApplication, error } = await this.supabase_client
      .from('job_applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('candidate_id', candidateId)
      .single();

    if (existingApplication) {
      throw new Error("You have already applied for this job.");
    }

    let resumeUrl: string | null = null;
    let resumeSummary: string | null = null;

    if (useDefaultResume) {
        
        const { data: candidateData, error: candidateError } = await this.supabase_client
          .from('candidates')
          .select('resume_url')
          .eq('id', candidateId)
          .single();

        if (candidateError) {
            throw new Error("Error fetching default resume: " + candidateError.message);
        }

        resumeUrl = candidateData?.resume_url;
        if (!resumeUrl) {
            throw new Error("No default resume found. Please upload a resume.");
        }
    } else if (resumeFile) {
       
        const fileExt = resumeFile.name.split('.').pop();
        const filePath = `resumes/${candidateId}/${jobId}.${fileExt}`;

        const { error: uploadError } = await this.supabase_client.storage
          .from('resumes')
          .upload(filePath, resumeFile, { contentType: resumeFile.type });

        if (uploadError) {
            throw new Error("Error uploading resume: " + uploadError.message);
        }

        const { data: publicUrlData } = this.supabase_client.storage
          .from('resumes')
          .getPublicUrl(filePath);

        resumeUrl = publicUrlData.publicUrl;
    }

    if (resumeUrl) {
            const body={ url: resumeUrl };
            console.log("body",body);
            const headers={
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc2J1dnd4cmNza2JxbHBja3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMjc1MjksImV4cCI6MjA1MzgwMzUyOX0.Etdq-sNv4UAhYFJDU4Wsz3x2L64ZEQqS-wuum25ATUE',
            };
            const response = await this.supabase_client.functions.invoke('extract-resume', {
              headers,
              method: 'POST',
              body,
            });

            const result = await response;
            console.log("Result :",result);
            this.resumeSummary = result || "No summary extracted."; 

            this.jobDescription=await this.getJobsById(jobId);
            console.log("Getting job Detaillss..:",this.jobDescription[0].description);

            

            this.ResumeATS=await this.getResumeMatch(this.jobDescription[0].description,this.resumeSummary.data.text);
            console.log("Resume response :",this.ResumeATS.overallMatchScore);
            this.overallMatchScore = this.ResumeATS.overallMatchScore;
            this.technicalSkillsMatch = this.ResumeATS.technicalSkillsMatch;
            this.experienceMatch = this.ResumeATS.experienceMatch;
            this.educationMatch = this.ResumeATS.educationMatch;
            this.missingSkills = this.ResumeATS.missingSkills || [];
            this.matchingSkills = this.ResumeATS.matchingSkills || [];
    }

    
    const { error: insertError } = await this.supabase_client
      .from('job_applications')
      .insert([{ job_id: jobId,
          candidate_id: candidateId,
          resume_url: resumeUrl,
          resume_summary: this.resumeSummary,
          overall_match_score: this.overallMatchScore,
          technical_skills_match: this.technicalSkillsMatch,
          experience_match: this.experienceMatch,
          education_match: this.educationMatch,
          missing_skills: this.missingSkills,
          matching_skills: this.matchingSkills
          }]);

    if (insertError) {
      throw insertError;
    }
}

  async getApplicationsForJob(jobId: string): Promise<any[]> {
    const { data, error } = await this.supabase_client
      .from('job_applications')
      .select('id, candidate_id, resume_url, candidates(fullname, email),resume_summary,overall_match_score,technical_skills_match,experience_match,missing_skills,matching_skills')
      .eq('job_id', jobId);
  
    if (error) {
      console.error("Error fetching job applications:", error.message);
      return [];
    }
  
    return data;
  }

  async getResumeMatch(jobDescription: string, resumeSummary: string): Promise<{
    overallMatchScore: number;
    technicalSkillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    missingSkills: string[];
    matchingSkills: string[];
  }> {
    try {
      const body = { 
        resume: resumeSummary,
        jobDescriptionText: jobDescription 
      };
      console.log("Request body:", body);
  
      const headers = {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc2J1dnd4cmNza2JxbHBja3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMjc1MjksImV4cCI6MjA1MzgwMzUyOX0.Etdq-sNv4UAhYFJDU4Wsz3x2L64ZEQqS-wuum25ATUE',
      };
  
      const { data, error } = await this.supabase_client.functions.invoke('ResumeATS', {
        headers,
        method: 'POST',
        body
      });
  
      if (error) {
        console.error('Error from Supabase Function:', error);
        throw new Error('Resume match function failed.');
      }
  
      console.log("Response data:", data);
      return data.matchPercentage;
    } catch (error) {
      console.error('Error fetching match percentage:', error);
      
      return {
        overallMatchScore: 0,
        technicalSkillsMatch: 0,
        experienceMatch: 0,
        educationMatch: 0,
        missingSkills: [],
        matchingSkills: []
      };
    }
  }
  

  async getJobsByRecruiter(recruiterId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase_client
        .from('jobs')
        .select('*')
        .eq('recruiter_id', recruiterId);
  
      if (error) {
        console.error("Error fetching recruiter's jobs:", error.message);
        return [];
      }
  
      return data;
    } catch (err) {
      console.error("JobService Error:", err);
      return [];
    }
  }

  async getJobApplications(jobId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase_client
        .from('job_applications')
        .select(`
          id,
          applied_at,
          resume_url,
          candidates:candidate_id (id, fullname, email, resume_url)
        `)
        .eq('job_id', jobId);
  
      if (error) {
        console.error("Error fetching job applications:", error.message);
        return [];
      }
  
      return data;
    } catch (err) {
      console.error("JobService Error:", err);
      return [];
    }
  }  
  
  async getJobsById(job_id: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase_client
        .from('jobs')
        .select('*')
        .eq('id', job_id); 
  
      if (error) {
        console.error("Error fetching jobs for id:", error.message);
        return [];
      }
  
      return data;
    } catch (err) {
      console.error("JobService Error:", err);
      throw err;
    }
  }

  

  async getComposeMail(emailList: string[], subject: string, message: string): Promise<number> {
    try {
      const body = {
        emailList, 
        subject,
        message
      };
  
      console.log("Sending email with body:", body);
  
      const { data, error } = await this.supabase_client.functions.invoke('send-email', {
        method: 'POST',
        body
      });
  
      if (error) {
        console.error('Error from Supabase Function:', error.message || error);
        return 0;
      }
      console.log('Email successfully sent:', data);
      return 1; 
    } catch (err) {
      console.error('Unexpected error sending email:', err);
      return 0;
    }
  }

  // job.service.ts

async getCandidateEmailsByIds(candidateIds: string[]): Promise<string[]> {
  try {
    const { data, error } = await this.supabase_client
      .from('candidates') 
      .select('email')
      .in('id', candidateIds);

    if (error) {
      console.error('Error fetching emails from Supabase:', error);
      return [];
    }

    return data.map((candidate: any) => candidate.email);
  } catch (err) {
    console.error('Unexpected error fetching emails:', err);
    return [];
  }
}

}
