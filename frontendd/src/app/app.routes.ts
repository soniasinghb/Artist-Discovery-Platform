import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ArtistsComponent } from './artists/artists.component';
import { FavoritesComponent } from './favorites/favorites.component';

export const routes: Routes = [
    {path: '', component: SearchComponent, pathMatch:'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'artists', component: ArtistsComponent},
    {path: 'favoritesComp', component: FavoritesComponent}
];
