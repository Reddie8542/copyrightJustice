import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpotifyService } from 'src/app/shared/services/spotify.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-content-creator-login',
  templateUrl: 'content-creator-login.component.html',
  styleUrls: ['content-creator-login.component.scss']
})
export class ContentCreatorLoginComponent implements OnInit {
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

  onSpotifySignIn(): void {
    const url = `${this.domain}/login/content-creator`;
    const callbackUrl = this.spotifyServ.getImplicitSignInUrl(url);
    location.href = callbackUrl;
  }

  onYoutubeSignIn(): void {

  }

  onContinueClick(): void {
    this.router.navigate(['/content-creator', 'lesson-builder']);
  }
}
