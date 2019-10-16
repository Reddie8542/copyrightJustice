import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly AUTH_BASE_URL = 'https://accounts.spotify.com/';
  private readonly WEB_API_BASE_URL = 'https://api.spotify.com/v1/';
  private readonly CJ_CLIENT_ID = '34ada31f63b84648acbc8be0904bcb03';
  private readonly AUTH_COOKIE_DURATION = 3600;
  private _token: string;

  constructor(private cookieService: CookieService,
              private http: HttpClient) { }

  get token(): string {
    const serviceToken = this._token;
    if (this.isTokenValid(serviceToken)) {
      return serviceToken;
    }
    const cookieToken = this.cookieService.get('spotifyToken');
    if (this.isTokenValid(cookieToken)) {
      this.token = cookieToken;
      return cookieToken;
    }
    return null;
  }

  set token(token: string) {
    this.cookieService.set('spotifyToken', token, this.AUTH_COOKIE_DURATION);
    this._token = token;
  }

  isAuthenticated(): boolean {
    return this.token != null;
  }

  private isTokenValid(token: string): boolean {
    return token != null && token !== '';
  }

  getImplicitSignInUrl(redirectUri: string): string {
    const endpoint = 'authorize';
    const responseType = 'token';
    const redirect = encodeURIComponent(redirectUri);
    const url = this.AUTH_BASE_URL + endpoint + `?response_type=${responseType}&client_id=${this.CJ_CLIENT_ID}&redirect_uri=${redirect}`;
    return url;
  }

  searchTrack(trackName: string) {
    const endpoint = 'search';
    const url = this.WEB_API_BASE_URL + endpoint;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const params = {
      q: trackName,
      type: 'track'
    };
    return this.http.get(url, { headers, params });
  }
}
