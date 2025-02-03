import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SupaService } from 'src/app/services/supa.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private supaService: SupaService,
              private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  public onSubmit(){
    this.supaService.signIn(this.loginForm.value.email,this.loginForm.value.password).then((res)=>{
      console.log(res);
      const role = res.data.user?.user_metadata?.['role'];  
        if (role === 'candidate') {
          this.router.navigate(['/candidate-dashboard']);
        } else if (role === 'recruiter') {
          this.router.navigate(['/recruiter-dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
    }).catch((err)=>{
      console.log(err);
    });
  }
  
  
}
