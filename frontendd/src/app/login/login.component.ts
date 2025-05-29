import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  constructor(private http: HttpClient, private authService: AuthService, private router:Router){}

  loginForm = new FormGroup({
    emailid: new FormControl('', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[\.]+[a-zA-Z]+'), Validators.required]),
    password: new FormControl('', Validators.required)  
  })

  onLogin(){
    this.http.post("/auth/login", {"emailid": this.loginForm.value.emailid, "password": this.loginForm.value.password}, {withCredentials: true}).subscribe((res: any)=>{
      if(res.result){
        // alert(res.message);
        this.authService.setAuthStatus(true);
        this.router.navigate(['/']);
      }
      else{

        if (res.message.includes('email')||res.message.includes('registered')) {
          this.loginForm.get('password')?.setErrors({ apiError: res.message });
        } 
      }
    }, (error)=>{
      console.log("error during login" + error.message);
    });
  }
}


