import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development'; 
@Injectable({
  providedIn: 'root'
})
export class SupaService {
  private supabase_client: SupabaseClient

  constructor() { 
    this.supabase_client=createClient(environment.supabase.supabaseUrl, environment.supabase.supabaseAnonKey)
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

  signIn(email: string, password: string){
    return this.supabase_client.auth.signInWithPassword({email, password});
  }
}
