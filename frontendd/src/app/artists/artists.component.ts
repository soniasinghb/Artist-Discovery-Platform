import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { FavServiceService } from '../services/fav-service.service';
import { ArtistInformationComponent } from '../artist-information/artist-information.component';

@Component({
  selector: 'app-artists',
  imports: [CommonModule, HttpClientModule, ArtistInformationComponent],
  templateUrl: './artists.component.html',
  styleUrl: './artists.component.css'
})
export class ArtistsComponent {
  @Input() artist : string = '';
  @Output() resultArrived = new EventEmitter<void>();

  constructor(private http: HttpClient, private authService: AuthService, private favService: FavServiceService){}
  artists: any[] = [];
  apicalldone = false;
  activeArtist :any = {};
  currTab: string = 'details';
  isUserLoggedIn: boolean = false;

  isActiveArtist(): boolean {
    return Object.keys(this.activeArtist).length !== 0;
  }

  updateCurrArtist(artist: any){
    this.activeArtist = artist;
    this.currTab = 'details';
  }

  updateActiveTab(tab: string){
    this.currTab = tab;
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((status)=>{
      this.isUserLoggedIn=status;
    })
    const artistsUrl = `/search?name=${encodeURIComponent(this.artist)}`;
    this.http.get(artistsUrl).subscribe({
      next: (res: any) => {
      if (res.result) {
        this.apicalldone = true;
        this.artists = res.message || [];
        this.resultArrived.emit();
      }else{
        this.artists = [];
        this.resultArrived.emit();
        this.apicalldone = true;
      }
    },
    error: (error) => {
      console.log(`Error during artist search: ${error.message}`);
      this.resultArrived.emit();
      this.apicalldone = true;
    }  
    });

    if(this.isUserLoggedIn){
      this.favService.fetchFavArtists();  
    }
  }
  
  isFav(artistid: string){
    return this.favService.isFav(artistid);
  }

  toggleFavs(artist: any){
    this.favService.toggleFavs(artist);
  }

}
