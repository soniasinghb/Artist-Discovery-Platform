import { Component, SimpleChange, SimpleChanges } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FavServiceService } from '../services/fav-service.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent {
  isUserLoggedIn: boolean = false;
  favArtists: any = [];
  favsArrival: boolean = false;
  timeDiff: {[key:string]:number} = {};

  constructor(private authService: AuthService, private router: Router, private http:HttpClient, private favService: FavServiceService){};

  ngOnInit(){
    this.authService.isAuthenticated$.subscribe((status)=>{
      this.isUserLoggedIn=status;
      if(status)
        this.fetchUserDetails();
    });

    this.favService.favArtists$.subscribe((favs)=>{
      this.favArtists = favs;
      // this.favsArrival = true;
    })
  }

  fetchUserDetails(){
    this.http.get('/favArtists/showFavs', {withCredentials: true}).subscribe({
      next : async(res: any) =>{
        if (res.result) {
          this.favArtists = res.message.favArtists;
          this.favsArrival = true;
          this.initialTimeDiff();
          console.log(this.favArtists);
        }
      },
      error: (error) => {
        console.log(`Error during artist fav fetch: ${error.message}`);
      } 
    })
  }

  initialTimeDiff(){
    const currtime = new Date().getTime();
    this.favArtists.forEach((fav: any)=>{
      const ogtime = new Date(fav.additionTime).getTime();
      this.timeDiff[fav.artistId]=Math.floor((currtime-ogtime)/1000);
    })
    this.updateTimer();
  }

  updateTimer(){
    let timer = setInterval(()=>{
      const timerTime = {...this.timeDiff};
      for(const id in timerTime){
        timerTime[id]+=1;
      }
      this.timeDiff = timerTime;
    }, 1000)
  }

  formatTime(time: number): string{
    if(time==1)
      return `${time} second ago`;
    else if(time<60)
      return `${time} seconds ago`;
    else if(time<3600){
      let mins = Math.floor(time/60);
      if(mins==1)
        return `${mins} minute ago`;
      return `${mins} minutes ago`;
    }
    else if(time<86400){
      let hrs = Math.floor(time/3600);
      if(hrs==1)
        return `${hrs} hour ago`;
      return `${hrs} hours ago`;
    }
    else{
      let days = Math.floor(time/86400);
      if(days==1)
        return `${days} day ago`;
      return `${days} days ago`;
    }
  }

  removeFav(artistid: string){
    console.log(artistid);
    this.favService.removeFav(artistid);
    this.favArtists = this.favArtists.filter((artist: any) => artist.artistId !== artistid);
  }

  gotoArtistInfo(artistid: string){
    localStorage.setItem('favArtist', artistid);
    this.router.navigate(['/']);
  }
}
