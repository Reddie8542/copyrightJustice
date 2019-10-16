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
              private spotifyService: SpotifyService) { }

  ngOnInit() {
    this.spotifyAccessToken = this.currentRoute.snapshot.fragment;
    if (this.spotifyAccessToken != null) {
      this.spotifyService.token = this.spotifyAccessToken;
    }
  }

  onYoutubeSignIn() {

  }

  onSpotifySignIn() {
    const redirectUri = 'http://localhost:4200/login';
    const implicitSignInUrl = this.spotifyService.getImplicitSignInUrl(redirectUri);
    location.href = implicitSignInUrl;
  }

  onContentCreatorClick() {
    this.router.navigate(['/login', 'content-creator']);
  }
}
