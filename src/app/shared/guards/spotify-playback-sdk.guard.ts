import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpotifyService } from '../services/spotify.service';


@Injectable({
  providedIn: 'root'
})
export class SpotifyPlaybackSDKGuard implements CanActivate {
  constructor(private spotService: SpotifyService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      const isSDKReady = this.spotService.isWebPlaybackSDKReady;
      if (!isSDKReady || isSDKReady == null) {
        return this.spotService.playbackSDKReady$;
      } else {
        return isSDKReady;
      }
  }
}
