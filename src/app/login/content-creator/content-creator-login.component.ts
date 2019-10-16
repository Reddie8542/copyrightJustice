import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-creator-login',
  templateUrl: 'content-creator-login.component.html',
  styleUrls: ['content-creator-login.component.scss']
})
export class ContentCreatorLoginComponent {
  spotifyAccessToken: string;

  constructor(private router: Router) { }

  onSpotifySignIn() {

  }

  onYoutubeSignIn() {

  }

  onContinueClick() {

  }

  onViewerSignIn() {
    this.router.navigate(['/login', 'viewer']);
  }
}
