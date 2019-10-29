import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';
import { Track } from '../models/track.model';
import { Artist } from '../models/artist.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  public static readonly WEB_API_BASE_URL = 'https://api.spotify.com/v1/';
  private static readonly AUTH_BASE_URL = 'https://accounts.spotify.com/';
  private static readonly CJ_CLIENT_ID = '34ada31f63b84648acbc8be0904bcb03';
  // tslint:disable-next-line: variable-name
  private _token: string;
  // tslint:disable-next-line: variable-name
  private _player: any;
  private _deviceId: string;
  playerStateChanges$: Subject<any> = new Subject<any>();

  constructor(private cookieService: CookieService,
              private http: HttpClient) { }

  get authToken(): string {
    const serviceToken = this._token;
    if (this.isTokenValid(serviceToken)) {
      return serviceToken;
    }
    const cookieToken = this.cookieService.get('spotifyToken');
    if (this.isTokenValid(cookieToken)) {
      this._token = cookieToken;
      return cookieToken;
    }
    return null;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  get player(): any {
    return this._player;
  }

  private convertToArtist(artist: any): Artist {
    return { id: artist.id, name: artist.name };
  }

  private convertToTrack(track: any): Track {
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

  clearAuthToken(): void {
    this.cookieService.delete('spotifyToken');
    this._token = null;
  }

  isAuthenticated(): boolean {
    return this.authToken != null;
  }

  initializePlayer() {
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      const Spotify = (window as any).Spotify;
      const player = new Spotify.Player({
        name: 'spotPlayer',
        getOAuthToken: cb => cb(this.authToken)
      });
      this.setPlayer(player);

      this.player.addListener('initialization_error', this.onSpotifyPlayerInitError.bind(this));
      this.player.addListener('authentication_error', this.onSpotifyPlayerAuthError.bind(this));
      this.player.addListener('account_error', this.onSpotifyPlayerAccountError.bind(this));
      this.player.addListener('playback_error', this.onSpotifyPlayerPlaybackError.bind(this));
      this.player.addListener('player_state_changed', this.onSpotifyPlayerStateChange.bind(this));
      this.player.addListener('not_ready', this.onSpotifyPlayerNotReady.bind(this));
      this.player.addListener('ready', this.onSpotifyPlayerReady.bind(this));
      this.player.connect();
    };
  }

  private isTokenValid(token: string): boolean {
    return token != null && token !== '';
  }

  getImplicitSignInUrl(redirectUri: string): string {
    const endpoint = 'authorize';
    const responseType = 'token';
    const redirect = encodeURIComponent(redirectUri);
    const scopes = 'streaming user-read-email user-read-private';
    return SpotifyService.AUTH_BASE_URL
            + endpoint
            + `?response_type=${responseType}`
            + `&scope=${scopes}`
            + `&client_id=${SpotifyService.CJ_CLIENT_ID}`
            + `&redirect_uri=${redirect}`;
  }

  private onSpotifyPlayerAccountError(message) {
    console.error('Spot player account error: ', message);
  }

  private onSpotifyPlayerAuthError(message) {
    console.error('Spot player auth error: ', message);
    this.clearAuthToken();
  }

  private onSpotifyPlayerInitError(message) {
    console.error('Spot player init error: ', message);
  }

  private onSpotifyPlayerNotReady(deviceId) {
    console.log('Spot player Device ID has gone offline: ', deviceId);
  }

  private onSpotifyPlayerPlaybackError(message) {
    console.error('Spot player playback error: ', message);
  }

  private onSpotifyPlayerReady(deviceId) {
    console.log('Spotify player ready. Device ID: ', deviceId);
    this.setDeviceId(deviceId.device_id);
  }

  private onSpotifyPlayerStateChange(playerState) {
    this.playerStateChanges$.next(playerState);
  }

  playTrack(trackId: string) {
    const endpoint = 'me/player/play';
    const spotifyUri = `spotify:track:${trackId}`;
    const url = SpotifyService.WEB_API_BASE_URL + endpoint;
    return this.http.put(
      url,
      JSON.stringify({ uris: [spotifyUri] }),
      {
        params: {
          'device_id': this.deviceId
        }
      }
    );
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

  /**
   * Parses the fragment generated by Spotify and sent as a fragment. It will
   * take the access token and expiration from the fragment, and set them
   * accordingly
   *
   * @param fragment The fragment generated by spotify WITHOUT ANY CHANGES
   */
  setAuthToken(fragment: string) {
    const [accessTokenString, , expiresInString] =  fragment.split('&');
    const spotifyCookie = {
      accessToken: accessTokenString.replace('access_token=', ''),
      expiresIn: expiresInString.replace('expires_in=', '')
    };
    this.cookieService.set(
      'spotifyToken',
      spotifyCookie.accessToken,
      Number(spotifyCookie.expiresIn)
    );
    this._token = spotifyCookie.accessToken;
  }

  private setDeviceId(deviceId: string) {
    this._deviceId = deviceId;
  }

  private setPlayer(player: any) {
    this._player = player;
  }
}
