import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArtistsComponent } from '../artists/artists.component';
import { HttpClientModule } from '@angular/common/http';
import { ArtistInformationComponent } from '../artist-information/artist-information.component';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, ArtistsComponent, HttpClientModule, ArtistInformationComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent{
  searchClicked = false;
  searchInput = new FormControl('');
  spinner = false;
  favartistid : string = '';

  ngOnInit(){
    if (typeof window !== 'undefined') {
      const favartist = localStorage.getItem('favArtist');
      if(favartist){
        this.favartistid = favartist;
        // console.log(favartistid);
        localStorage.removeItem('favArtist');
      }
  }
  }

  onSearch(){
    this.favartistid = '';
    if(!this.searchInput.value) return;
    this.spinner = true;
    this.searchClicked = false;
    setTimeout(() => {
     this.searchClicked = true;
    });
  }

  onClear(){
    this.favartistid = '';
    this.searchInput.reset();
    this.searchClicked = false;
    this.spinner = false;
  }

  onResultArrived(){
    this.spinner = false;
    console.log("emitted");
  }
}
