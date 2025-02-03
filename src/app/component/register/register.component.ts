import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SupaService } from 'src/app/services/supa.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!:FormGroup;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private supaService: SupaService
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(5)]],
      username: ['', [Validators.required, Validators.minLength(5)]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }


  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
  
  public onSubmit(){
    this.supaService.signUp(this.registerForm.value.email,this.registerForm.value.password,this.registerForm.value.username,this.registerForm.value.role).then((res)=>{
      console.log(res);
    }).catch((err)=>{
      console.log(err);
    });
  }
  
}
