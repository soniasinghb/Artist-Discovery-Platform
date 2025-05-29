import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {  
  isUserLoggedIn: boolean = false;
  userName:string = '';
  gravatarImg: string = '';

  constructor(private authService: AuthService, private router: Router, private http:HttpClient, private NotificationsService: NotificationsService){};

  ngOnInit(){
    this.authService.isAuthenticated$.subscribe((status)=>{
      this.isUserLoggedIn=status;
      if(status)
        this.fetchUserDetails();
    })
  }

  onLogOut(){
    this.http.post("/auth/logout", {}, {withCredentials: true}).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.authService.setAuthStatus(false);
          this.router.navigate(['/']);
          this.NotificationsService.show("Logged out", "success");
        }
      },
      error: (error) => {
        console.log(`Error during logout: ${error.message}`);
      }
    });
  }

  onDeleteAcc(){
    this.http.delete("/auth/deleteAccount", {withCredentials: true}).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.authService.setAuthStatus(false);
          this.router.navigate(['/']);
          this.NotificationsService.show("Account deleted", "danger");
        }
      },
      error: (error) => {
        console.log(`Error during account deletion: ${error.message}`);
      }
    });
  }

  fetchUserDetails(){
    this.http.get('/auth/me', {withCredentials: true}).subscribe({
      next : (res: any) =>{
        if (res.result) {
          this.userName = res.message.fullname;
          this.gravatarImg = res.message.profileImageUrl;
          // console.log(this.userName);
        }
      },
      error: (error) => {
        console.log(`Error during artist fav fetch: ${error.message}`);
      } 
    })
  }
}
