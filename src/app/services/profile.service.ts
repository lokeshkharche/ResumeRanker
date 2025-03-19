import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
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

  async getCandidateDetails(userId: string) {
    const { data, error } = await this.supabase_client
      .from('candidates') 
      .select('*') 
      .eq('id', userId)
      .single(); 

    if (error) {
      console.error('Error fetching candidate details:', error);
      throw error;
    }

    return data; 
  }

  async updateCandidateDetails(candidateId: string, updatedData: Partial<any>) {
    const { data, error } = await this.supabase_client
      .from('candidates')
      .update(updatedData)
      .eq('id', candidateId)
      .select();
      console.log("Updated data :",updatedData);

    if (error) {
      console.error('Error updating candidate details:', error);
      return null;
    }
    return data;
  }
  /**
   * Uploads a resume file to Supabase Storage.
   * @param filePath The path in Supabase Storage where the file will be stored.
   * @param file The File object to upload.
   * @returns The public URL of the uploaded file or null if the upload fails.
   */
  async uploadFile(userId: string, file: File): Promise<string | null> {
    try {
      const filePath = `${userId}/${file.name}`;
  
      const { data, error } = await this.supabase_client.storage
        .from('resumes')
        .upload(filePath, file, { upsert: true });
  
      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }
  
     
      const { data: publicUrlData } = this.supabase_client.storage
        .from('resumes')
        .getPublicUrl(filePath);
  
      const publicUrl = publicUrlData.publicUrl;
  
      if (!publicUrl) {
        console.error('Error retrieving public URL.');
        return null;
      }

      await this.updateCandidateDetails(userId, { resume_url: publicUrl });
  
      return publicUrl;
    } catch (err) {
      console.error('Upload failed:', err);
      return null;
    }
  }
  

  async getRecruiterDetails(userId: string) {
    const { data, error } = await this.supabase_client
      .from('recruiters')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Error fetching recruiter details:", error);
      return null;
    }
    
    return data;
  }
  
  async updateRecruiterDetails(userId: string, updatedData: any) {
    const { data, error } = await this.supabase_client
      .from('recruiters')
      .update(updatedData)
      .eq('id', userId)
      .select()
      .single();
  
    if (error) {
      console.error("Error updating recruiter details:", error);
      return null;
    }
  
    return data;
  }
  async uploadCompanyLogo(userId: string, file: File): Promise<string | null> {
    try {
        const filePath = `${userId}/${file.name}`;
  
        const { data, error } = await this.supabase_client.storage
            .from('logo')
            .upload(filePath, file, { upsert: true });

        if (error) {
            console.error('Error uploading company logo:', error);
            return null;
        }

        const { data: publicUrlData } = this.supabase_client.storage
            .from('logo')
            .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;

        if (!publicUrl) {
            console.error('Error retrieving company logo URL.');
            return null;
        }

        await this.updateRecruiterDetails(userId, { company_logo_url: publicUrl });

        return publicUrl;
    } catch (err) {
        console.error('Company logo upload failed:', err);
        return null;
    }
}

  
}
