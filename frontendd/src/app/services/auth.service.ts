import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubj = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubj.asObservable();

  constructor(private http: HttpClient) {};

  setAuthStatus(status: boolean){
    this.isAuthenticatedSubj.next(status);
  }  

  checkAuthStatus(){
     return this.http.get('/auth/me', {withCredentials: true}).pipe(
      tap((response: any) =>{
        if(response.result){
          this.setAuthStatus(true);
        }
        else
          this.setAuthStatus(false);
      }),
    catchError((error)=>{
        this.setAuthStatus(false);
        // console.log("error with auth status", error);
        return [];
      }
    ));
  }

}
