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
  spotifyAccessToken: string;

  constructor(private cookieService: CookieService,
              private currentRoute: ActivatedRoute,
              private router: Router,
              private spotifyServ: SpotifyService) { }

  ngOnInit() {
    const fragment = this.currentRoute.snapshot.fragment;
    if (fragment == null) {
      let token = this.spotifyServ.token;
      if (!this.isTokenValid(token)) {
        token = this.cookieService.get('spotifyToken');
        if (!this.isTokenValid(token)) {
          this.spotifyAccessToken = null;
        } else {
          this.spotifyServ.token = token;
          this.spotifyAccessToken = token;
        }
      } else {
        this.spotifyAccessToken = token;
      }
    } else {
      const [accessTokenString, , expiresInString] =  fragment.split('&');
      const spotifyCookie = {
        accessToken: accessTokenString.replace('access_token=', ''),
        expiresIn: expiresInString.replace('expires_in=', '')
      };
      this.spotifyServ.token = spotifyCookie.accessToken;
      this.spotifyAccessToken = spotifyCookie.accessToken;
    }
  }

  private isTokenValid(token: string): boolean {
    return token != null && token !== '';
  }

  onSpotifySignIn(): void {
    const redirectUrl = 'http://localhost:4200/login/content-creator';
    const spotUrl = this.spotifyServ.getImplicitSignInUrl(redirectUrl);
    location.href = spotUrl;
  }

  onYoutubeSignIn(): void {

  }

  onContinueClick(): void {

  }

  onViewerSignIn(): void {
    this.router.navigate(['/login', 'viewer']);
  }
}
