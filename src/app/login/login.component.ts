import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../shared/services/spotify.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  spotifyAccessToken: string;

  constructor(private currentRoute: ActivatedRoute,
              private router: Router,
              private spotifyServ: SpotifyService) { }

  ngOnInit() {
    const fragment = this.currentRoute.snapshot.fragment;
    if (fragment == null) {
      const isSpotifyAuthenticated = this.spotifyServ.isAuthenticated();
      this.spotifyAccessToken = isSpotifyAuthenticated ? this.spotifyServ.authToken : null;
    }
  }

  onContinueClick() {

  }

  onSpotifySignIn() {
    const redirectUri = 'http://localhost:4200/login/viewer';
    const implicitSignInUrl = this.spotifyServ.getImplicitSignInUrl(redirectUri);
    location.href = implicitSignInUrl;
  }

  onContentCreatorSignIn() {
    this.router.navigate(['/login', 'content-creator']);
  }
}
