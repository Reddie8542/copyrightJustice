import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';
import { Track } from '../models/track.model';
import { Artist } from '../models/artist.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private static readonly AUTH_BASE_URL = 'https://accounts.spotify.com/';
  public static readonly WEB_API_BASE_URL = 'https://api.spotify.com/v1/';
  private static readonly CJ_CLIENT_ID = '34ada31f63b84648acbc8be0904bcb03';
  private static readonly AUTH_COOKIE_DURATION = 3600;
  // tslint:disable-next-line: variable-name
  private _token: string;

  constructor(private cookieService: CookieService,
              private http: HttpClient) { }

  get authToken(): string {
    const serviceToken = this._token;
    if (this.isTokenValid(serviceToken)) {
      return serviceToken;
    }
    const cookieToken = this.cookieService.get('spotifyToken');
    if (this.isTokenValid(cookieToken)) {
      this.authToken = cookieToken;
      return cookieToken;
    }
    return null;
  }

  set authToken(token: string) {
    this.cookieService.set('spotifyToken', token, SpotifyService.AUTH_COOKIE_DURATION);
    this._token = token;
  }

  deleteAuthToken(): void {
    this.cookieService.delete('spotifyToken');
    this._token = null;
  }

  isAuthenticated(): boolean {
    return this.authToken != null;
  }

  private isTokenValid(token: string): boolean {
    return token != null && token !== '';
  }

  getImplicitSignInUrl(redirectUri: string): string {
    const endpoint = 'authorize';
    const responseType = 'token';
    const redirect = encodeURIComponent(redirectUri);
    return SpotifyService.AUTH_BASE_URL
            + endpoint
            + `?response_type=${responseType}`
            + `&client_id=${SpotifyService.CJ_CLIENT_ID}`
            + `&redirect_uri=${redirect}`;
  }

  searchTracks(trackName: string): Observable<Track[]> {
    const endpoint = 'search';
    const url = SpotifyService.WEB_API_BASE_URL + endpoint;
    const params = {
      q: trackName,
      type: 'track'
    };
    return this.http.get(url, { params }).pipe(
      map((response: any) => {
        const trackJSONs = response.tracks.items;
        return trackJSONs.map(track => this.convertToTrack(track));
      })
    );
  }

  convertToArtist(artist: any): Artist {
    return { id: artist.id, name: artist.name };
  }

  convertToTrack(track: any): Track {
    const artists: Artist[] = track.artists.map(
      artist => this.convertToArtist(artist)
    );
    return {
      album: track.album,
      artists,
      duration: track.duration_ms,
      id: track.id,
      name: track.name
    };
  }
}
