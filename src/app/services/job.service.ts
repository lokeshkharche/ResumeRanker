import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class JobService {
   private supabase_client: SupabaseClient;
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

  
  async applyForJob(jobId: string, candidateId: string, useDefaultResume: boolean, resumeFile?: File): Promise<any> {
    try {
      // Check if the candidate has already applied for this job
      const { data: existingApplication, error: checkError } = await this.supabase_client
        .from('job_applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('candidate_id', candidateId)
        
  
      if (existingApplication) {
        alert("You have already applied for this job.");
        return;
      }
  
      if (checkError && checkError.code !== 'PGRST116') {  // Ignore 'no rows found' error
        console.error("Error checking existing application:", checkError.message);
        throw new Error(checkError.message);
      }
  
      let resumeUrl = null;
  
      // Fetch candidate profile to get default resume
      if (useDefaultResume) {
        const { data: candidate, error } = await this.supabase_client
          .from('candidates')
          .select('resume_url')
          .eq('id', candidateId)
          .single();
  
        if (error) {
          console.error("Error fetching candidate resume:", error.message);
          throw new Error(error.message);
        }
  
        resumeUrl = candidate?.resume_url;
      }
  
      // If a new resume is uploaded, store it in Supabase
      if (!useDefaultResume && resumeFile) {
        const { data, error } = await this.supabase_client.storage
          .from('resumes')
          .upload(`candidate_${candidateId}/${resumeFile.name}`, resumeFile, { upsert: true });
  
        if (error) {
          console.error("Error uploading resume:", error.message);
          throw new Error(error.message);
        }
  
        resumeUrl = data?.path ? `https://bosbuvwxrcskbqlpckpu.supabase.co/storage/v1/object/public/resumes/${data.path}` : null;
      }
  
      if (!resumeUrl) {
        alert("No resume selected. Please upload one or use the default resume.");
        return;
      }
  
      // Insert job application with resume URL
      const { data, error } = await this.supabase_client
        .from('job_applications')
        .insert([{ job_id: jobId, candidate_id: candidateId, resume_url: resumeUrl }]);
  
      if (error) {
        console.error("Error inserting job application:", error.message);
        throw new Error(error.message);
      }
  
      return data;
    } catch (err) {
      console.error("JobService Error:", err);
      throw err;
    }
  }
  
  
  async getApplicationsForJob(jobId: string): Promise<any[]> {
    const { data, error } = await this.supabase_client
      .from('job_applications')
      .select('id, candidate_id, resume_url, candidates(fullname, email)')
      .eq('job_id', jobId);
  
    if (error) {
      console.error("Error fetching job applications:", error.message);
      return [];
    }
  
    return data;
  }

  async getJobsByRecruiter(recruiterId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase_client
        .from('jobs')
        .select('*')
        .eq('recruiter_id', recruiterId); // Fetch jobs where recruiter_id matches
  
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
  
}
