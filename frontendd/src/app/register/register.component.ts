import { HttpClient , HttpClientModule} from '@angular/common/http';
import { Component } from '@angular/core';
import { EmailValidator, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  constructor(private http: HttpClient, private authService: AuthService, private router: Router){}  

  registrationForm = new FormGroup({
    fullname: new FormControl('', Validators.required),
    emailid: new FormControl('', [Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[\.]+[a-zA-Z]+'), Validators.required]),
    password: new FormControl('', Validators.required)
  })
  onRegister(){
    this.http.post("/auth/register", {"fullname": this.registrationForm.value.fullname, 
      "emailid": this.registrationForm.value.emailid, "password": this.registrationForm.value.password}, 
      {withCredentials: true}).subscribe((res:any)=>{
      if(res.result){
        this.authService.setAuthStatus(true);
        this.router.navigate(['/']);
      }else{
        if (res.message.includes('email')) {
          this.registrationForm.get('emailid')?.setErrors({ apiError: res.message });
        } 
      }
    }, (error)=>{
      console.log(error.error?.message || "Unknown error");
    })
  }
}
