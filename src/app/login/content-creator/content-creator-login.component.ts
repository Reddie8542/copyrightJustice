import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpotifyService } from 'src/app/shared/services/spotify.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-content-creator-login',
  templateUrl: 'content-creator-login.component.html',
  styleUrls: ['content-creator-login.component.scss']
})
export class ContentCreatorLoginComponent implements OnInit {
  isSpotifyAuthenticated: boolean;

  constructor(private cookieService: CookieService,
              private currentRoute: ActivatedRoute,
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

  onSpotifySignIn(): void {
    const redirectUrl = 'http://localhost:4200/login/content-creator';
    const spotUrl = this.spotifyServ.getImplicitSignInUrl(redirectUrl);
    location.href = spotUrl;
  }

  onYoutubeSignIn(): void {

  }

  onContinueClick(): void {
    this.router.navigate(['/content-creator', 'lesson-builder']);
  }
}
