import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase_client: SupabaseClient;
  private authState = new BehaviorSubject<Session | null>(null);

  constructor(private router: Router) {
    this.supabase_client = createClient(environment.supabase.supabaseUrl, environment.supabase.supabaseAnonKey);
    this.supabase_client.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      this.authState.next(session);
    });
    this.checkSession();
  }

  private async checkSession() {
    const { data } = await this.supabase_client.auth.getSession();
    this.authState.next(data.session);
  }

  get isAuthenticated() {
    return this.authState.asObservable();
  }

  async login(email: string, password: string) {
    try {
      const { data, error } = await this.supabase_client.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const user = await this.getCurrentUser();
      if (!user) throw new Error("User not found");

      const { data: userData, error: userError } = await this.supabase_client
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      const role = userData.role;

      if (role === 'candidate') {
        this.router.navigate(['/candidate-dashboard']);
      } else if (role === 'recruiter') {
        this.router.navigate(['/recruiter-dashboard']);
      } else {
        throw new Error('Invalid role');
      }

      this.authState.next(data.session);
      return data.session;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async logout() {
    await this.supabase_client.auth.signOut();
    this.authState.next(null);
    this.router.navigate(['/login']); 
  }

  async getCurrentUser() {
    const { data } = await this.supabase_client.auth.getUser();
    return data.user;
  }
}
