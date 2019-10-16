import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpotifyService } from '../services/spotify.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthGuard implements CanActivate {
  constructor(private spotifyServ: SpotifyService,
              private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean | UrlTree {
      const isAuthenticated = this.spotifyServ.isAuthenticated();
      return isAuthenticated ? true : this.router.parseUrl('/login/viewer');
  }
}
