import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SpotifyService } from '../services/spotify.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpotifyPlayerResolver implements Resolve<boolean> {
  constructor(private spotifyServ: SpotifyService,
              private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
    const player = this.spotifyServ.player;
    if (player != null) {
      return true;
    } else {
      this.spotifyServ.initializePlayer().then(
        initCorrectly => {
          if (!initCorrectly) {
            console.error('Spotify player wasn\'t initialized correctly');
            this.router.navigate(['/login', 'viewer'], {
              queryParams: route.queryParams
            });
          }
        }
      );
    }
  }
}
