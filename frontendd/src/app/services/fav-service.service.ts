import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class FavServiceService {
  private favArtistsSubject = new BehaviorSubject<any[]>([]);
  favArtists$ = this.favArtistsSubject.asObservable();

  constructor(private http: HttpClient, private notificationsService: NotificationsService) {};

  fetchFavArtists() : void {
    this.http.get('/favArtists/showFavs', {withCredentials: true}).subscribe({
      next: (res: any) => {
        if (res.result) {
          this.favArtistsSubject.next( res.message.favArtists || []);
        }else{
          this.favArtistsSubject.next([]);
        }
      },
      error: (error) => {
        console.log(`Error during artist fav fetch: ${error.message}`);
      }  
    });
  }

  
  isFav(artistid: string){
    return this.favArtistsSubject.value.some((fav: any)=> fav.artistId===artistid);
  }

  toggleFavs(artist: any){
    if(this.favArtistsSubject.value.some((fav: any)=> fav.artistId===artist.artist_ID)){
      this.removeFav(artist.artist_ID);
    }
    else{
      this.addFav(artist);
    }
  }

  removeFav(artistid: string){
    this.http.delete('/favArtists/removeFav', {body: {artistId: artistid}, withCredentials: true}).subscribe({
      next: (res: any) => {
        if (res.result) {
          const updatedFavs = this.favArtistsSubject.value.filter((fav: any) => fav.artistId !== artistid);
          this.favArtistsSubject.next(updatedFavs); 
          this.notificationsService.show("Removed from favorites", "danger");
        }
      },
      error: (error) => {
        console.error('Error adding favorite:', error);
      },
    })
  }

  addFav(artist: any){
    // console.log(artist.artist_ID);
    const detailsUrl = `/artists/${artist.artist_ID}`;

    this.http.get(detailsUrl).subscribe({
      next: (res: any) => {
        let artistDetails: any = {};
        if (res.result) {
          artistDetails = res.message || {};
        }else{
         artistDetails = {};
        }
        // console.log(artistDetails);
        const payload = {
        artistId: artist.artist_ID,
        artistName: artist.artist_Title,
        artistBday: artistDetails.artist_bday,
        artistDday: artistDetails.artist_dday,
        artistNationality: artistDetails.artist_nationality,
        artistImg: artist.artist_Image,
        additionTime: Date.now(),
        };
        this.http.post('/favArtists/addFav', payload, {withCredentials: true}).subscribe({
        next: (res: any) => {
          if (res.result) {
            const currFavs = this.favArtistsSubject.value;
            this.favArtistsSubject.next([...currFavs, payload]); 
            this.notificationsService.show("Added to favorites", "success");
          }
          },
          error: (error) => {
            console.error('Error adding favorite:', error);
          },
        });
      } ,
      error: (error) => {
        console.log(`Error during artist search in fav: ${error.message}`);
      }  
    });
    
  }
}
