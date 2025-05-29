import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FavServiceService } from '../services/fav-service.service';

@Component({
  selector: 'app-artist-information',
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './artist-information.component.html',
  styleUrl: './artist-information.component.css'
})
export class ArtistInformationComponent {
  @Input() activeArtistObj: any = {};
  @Input() activeArtistId: string = '';
  currTab : string = 'details';
  updateActiveTab(tab: string){
    this.currTab = tab;
    if(tab==='details'){
      this.loadArtistDetails();
    }
    else if(tab==='artwork'){
      this.loadArtworks();
    }
  }

  artistDetails: any = {};
  detailsResponseArrival:boolean = false;
  simArtists: any = [];
  isUserLoggedIn: boolean = false;

  artworks: any = [];
  // spinner:boolean = false;
  artworksResponseArrival:boolean = false;
  currArtwork: any = {};
  modals: any = [];
  categoriesArrival:boolean = false;
  currtitle:string = ''; 
  currdate: string = ''; 
  currimg: string = '';

  constructor(private authService: AuthService, private router: Router, private http:HttpClient, private favService: FavServiceService){};

  ngOnInit(){
    // console.log(this.activeArtistObj);
    // console.log(this.activeArtistId);
    this.authService.isAuthenticated$.subscribe((status)=>{
      this.isUserLoggedIn=status;
      if(status){
        this.favService.fetchFavArtists();  
      }
    });

    if(this.currTab==='details')
      this.loadArtistDetails();
    else if(this.currTab === 'artwork')
      this.loadArtworks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeArtistId'] && this.activeArtistId) {
      this.loadArtistDetails();
      this.loadArtworks();
      this.currTab === 'details'
    }
    
    if (changes['activeArtistObj'] ) {
      console.log('Active artist updated:', this.activeArtistObj);
    }
  }


  loadArtistDetails(){
    const detailsUrl = `/artists/${this.activeArtistId}`;
    const artistsUrl = `/artists/artists/${(this.activeArtistId)}`;

      this.http.get(artistsUrl).subscribe({
        next: (res: any) => {
        if (res.result) {
          this.simArtists = res.message || [];
        }else{
          this.simArtists = [];
        }
      },
      error: (error) => {
        
      }  
      });

      this.http.get(detailsUrl).subscribe({
        next: (res: any) => {
          if (res.result) {
            this.artistDetails = res.message || {};
            this.detailsResponseArrival = true;
          }else{
            this.artistDetails = {};
            this.detailsResponseArrival = true;
          }
        },
        error: (error) => {
          console.log(`Error during artist search: ${error.message}`);
        }  
      });
  }

  loadArtworks(){
    const artworksUrl = `/artworks/${this.activeArtistId}`;
    // console.log(this.activeArtistId);
    this.http.get(artworksUrl).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.artworks = res.message || [];
          this.artworksResponseArrival = true;
        }else{
          this.artworks = [];
          this.artworksResponseArrival = true;
        }
      },
      error: (error) => {
        console.log(`Error during artist search: ${error.message}`);
        this.artworksResponseArrival = true;
      }  
    });
  }

  openArtworkModals(artworkid: string, currtitle:string, currdate: string, currimg: string){
    this.categoriesArrival = false;
    this.currtitle = currtitle;
    this.currdate = currdate;
    this.currimg = currimg;
    const genesUrl = `/genes/${encodeURIComponent(artworkid)}`;
    setTimeout(()=>{this.http.get(genesUrl).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.modals = res.message || [];
          this.categoriesArrival = true;
        }else{
          this.modals = [];
          this.categoriesArrival = true;
        }
      },
      error: (error) => {
        console.log(`Error during modals click: ${error.message}`);
        this.categoriesArrival = true;
      }  
    })}, 50);
  }

  isFav(artistid: string){
    return this.favService.isFav(artistid);
  }  

  toggleFavs(artistobj: any){
    // console.log(this.activeArtist);
    this.favService.toggleFavs(artistobj);
  }

  gotoDetails(artistid: string){
    this.activeArtistId = artistid;
    this.loadArtistDetails();
    this.loadArtworks();
  }

}

