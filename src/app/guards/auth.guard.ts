import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { SupaService } from "../services/supa.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private supaService: SupaService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {  
    console.log(" Checking user session in AuthGuard...");
    
    
    const { data, error } = await this.supaService.getSession();

    if (error || !data.session) {
      console.warn('No active session found. Redirecting to login.');
      this.router.navigate(['/login']);
      return false;
    }

    const userRole = data.session.user?.user_metadata['role'];
    const expectedRole = route.data['role'];

    if (userRole === expectedRole) {
      console.log("User authorized, granting access.");
      return true;
    } else {
      console.warn(` Unauthorized access: Expected role: ${expectedRole}, Found role: ${userRole}`);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
