import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupaService {
  private supabase_client: SupabaseClient;
  private authStateSubject = new BehaviorSubject<Session | null>(null);
  public isAuthenticated: Observable<Session | null>;

  constructor() { 
    this.supabase_client = createClient('https://bosbuvwxrcskbqlpckpu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc2J1dnd4cmNza2JxbHBja3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMjc1MjksImV4cCI6MjA1MzgwMzUyOX0.Etdq-sNv4UAhYFJDU4Wsz3x2L64ZEQqS-wuum25ATUE',{
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: localStorage
      }
    });
    console.log("supabase ",this.supabase_client);
    // Observe authentication state
    this.isAuthenticated = this.authStateSubject.asObservable();

    this.supabase_client.auth.getSession().then(({ data: { session } }) => {
      this.authStateSubject.next(session);
    });

    this.supabase_client.auth.onAuthStateChange((_, session) => {
      this.authStateSubject.next(session);
    });
  }

  async getSession() {
    return await this.supabase_client.auth.getSession();
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase_client.auth.signInWithPassword({ email, password });
  
    if (error) {
      console.error('Login failed:', error.message);
      throw new Error(error.message);
    }
  
    return data; 
  }
  

  async getCurrentUser() {
    const { data, error } = await this.supabase_client.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data.user;
  }
  
  async refreshSession() {
    console.log("Refreshing session...");
    const { data, error } = await this.supabase_client.auth.refreshSession();
    if (error) console.error('Session refresh error:', error);
    return data;
  }
  

  
  async getUserRole(userId: string) {
    const { data, error } = await this.supabase_client.auth.getUser();
  
    if (error || !data?.user) {
      console.error("Error fetching user:", error);
      return null;
    }
  
    return { role: data.user.user_metadata['role'] || "unknown" }; 
  }
  

  async signOut() {
    await this.supabase_client.auth.signOut();
    this.authStateSubject.next(null);
  }
  async signUp(email: string, password: string, username: string, role: string) {
    try {
      const { data, error } = await this.supabase_client.auth.signUp({
        email,
        password,
        options: {
          data: { username, role } 
        }
      });
  
      if (error) {
        throw error;
      }
  
      return data.user;
    } catch (error: any) {
      console.error('Error during sign-up:', error.message);
      throw error;
    }
  }
  
  async saveUserData(user: any) {
    const role = user?.user_metadata['role']; 
    const userData = {
      id: user.id,
      email: user.email,
      // full_name: user.user_metadata['full_name'] || '',
      created_at: new Date(),
      username: user.user_metadata['username'] || '',
    };

    console.log("user?.user_metadata",user?.user_metadata);
    
    console.log("user Data :",userData);

    if (role === 'candidate') {
      // Insert into candidates table
      const { error } = await this.supabase_client.from('candidates').upsert(userData);
      if (error) throw error;
    } else if (role === 'recruiter') {
      // Additional recruiter-specific fields
      const recruiterData = {
        ...userData,
        // company_name: user.user_metadata['company_name'] || '',
        // company_website: user.user_metadata['company_website'] || '',
        // industry: user.user_metadata['industry'] || '',
        // company_description: user.user_metadata['company_description'] || '',
        // phone_number: user.user_metadata['phone_number'] || '',
        // company_address: user.user_metadata['company_address'] || '',
        // number_of_employees: user.user_metadata['number_of_employees'] || null,
        // headquarters_location: user.user_metadata['headquarters_location'] || '',
        // company_logo_url: user.user_metadata['company_logo_url'] || '',
      };

      console.log("Recruiter Data:", recruiterData);
      
      const { error } = await this.supabase_client.from('recruiters').upsert(recruiterData);
      if (error) throw error;
      console.log("Recruiter data saved successfully.");
    } else {
      console.error("Invalid role:", role);
      throw new Error("Invalid role provided.");
    }
  } catch (error: any) {
    console.error("Error saving user data:", error.message);
  }
}
