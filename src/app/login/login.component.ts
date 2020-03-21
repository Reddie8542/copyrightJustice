import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../shared/services/spotify.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  domain: string;
  isSpotifyAuthenticated: boolean;

  constructor(private currentRoute: ActivatedRoute,
              private router: Router,
              private spotifyServ: SpotifyService) { }

  ngOnInit() {
    this.domain = environment.domain;
    this.isSpotifyAuthenticated = this.spotifyServ.isAuthenticated();
    if (!this.isSpotifyAuthenticated) {
      const fragment = this.currentRoute.snapshot.fragment;
      if (fragment != null) {
        this.spotifyServ.setAuthToken(fragment);
        this.isSpotifyAuthenticated = this.spotifyServ.isAuthenticated();
      }
    }
  }

  onContinueClick() {
    this.router.navigate(['/lesson'], { queryParamsHandling: 'preserve' });
  }

  onSpotifySignIn() {
    const url = `${this.domain}/login/viewer`;
    const callbackUrl = this.spotifyServ.getImplicitSignInUrl(url);
    location.href = callbackUrl;
  }
}
