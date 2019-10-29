import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../shared/services/spotify.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  isSpotifyAuthenticated: boolean;

  constructor(private currentRoute: ActivatedRoute,
              private router: Router,
              private spotifyServ: SpotifyService) { }

  ngOnInit() {
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
    const redirectUri = 'http://localhost:4200/login/viewer';
    const implicitSignInUrl = this.spotifyServ.getImplicitSignInUrl(redirectUri);
    location.href = implicitSignInUrl;
  }
}
