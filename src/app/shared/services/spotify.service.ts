import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private _token: string;
  private _player: any;
  private _deviceId: string;
  private _isWebPlaybackSDKReady: boolean;
  private _playbackSDKReady: Subject<boolean> = new Subject<boolean>();
  playerStateChanges$: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) { }

  get authToken(): string {
    const serviceToken = this.token;
    if (this.isTokenValid(serviceToken)) {
      return serviceToken;
    }
    const storageToken = localStorage.getItem('spotifyToken');
    if (this.isTokenValid(storageToken)) {
      this.token = storageToken;
      return storageToken;
    }
    return null;
  }

  get deviceId(): string {
    return this._deviceId;
  }

  set deviceId(deviceId: string) {
    this._deviceId = deviceId;
  }

  get isWebPlaybackSDKReady(): boolean {
    return this._isWebPlaybackSDKReady;
  }

  set isWebPlaybackSDKReady(isWebPlaybackSDKReady: boolean) {
    this._isWebPlaybackSDKReady = isWebPlaybackSDKReady;
    this._playbackSDKReady.next(isWebPlaybackSDKReady);
  }

  get playbackSDKReady$(): Observable<boolean> {
    return this._playbackSDKReady.asObservable();
  }

  get player(): any {
    return this._player;
  }

  set player(player: any) {
    this._player = player;
  }

  get token(): string {
    return this._token;
  }

  set token(token: string) {
    this._token = token;
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
    localStorage.removeItem('spotifyToken');
    this._token = null;
  }

  /**
   * Initializes the Spotify playback player
   *
   * @returns A promise that will resolve true if player was initialized correctly.
   * False otherwise
   *
   */
  initializePlayer(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const Spotify = (window as any).Spotify;
      this.player = new Spotify.Player({
        name: 'spotPlayer',
        getOAuthToken: cb => cb(this.authToken)
      });

      this.player.addListener('initialization_error', this.onSpotifyPlayerInitError.bind(this, resolve));
      this.player.addListener('authentication_error', this.onSpotifyPlayerAuthError.bind(this, resolve));
      this.player.addListener('account_error', this.onSpotifyPlayerAccountError.bind(this, resolve));
      this.player.addListener('playback_error', this.onSpotifyPlayerPlaybackError.bind(this, resolve));
      this.player.addListener('player_state_changed', this.onSpotifyPlayerStateChange.bind(this));
      this.player.addListener('not_ready', this.onSpotifyPlayerNotReady.bind(this, resolve));
      this.player.addListener('ready', this.onSpotifyPlayerReady.bind(this, resolve));
      this.player.connect();
    });
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
    const scopes = 'streaming user-read-email user-read-private';
    return SpotifyService.AUTH_BASE_URL
            + endpoint
            + `?response_type=${responseType}`
            + `&scope=${scopes}`
            + `&client_id=${SpotifyService.CJ_CLIENT_ID}`
            + `&redirect_uri=${redirect}`;
  }

  private onSpotifyPlayerAccountError(resolve, message) {
    console.error('Spot player account error: ', message);
    resolve(false);
  }

  private onSpotifyPlayerAuthError(resolve, message) {
    console.error('Spot player auth error: ', message);
    resolve(false);
    this.clearAuthToken();
  }

  private onSpotifyPlayerInitError(resolve, message) {
    console.error('Spot player init error: ', message);
    resolve(false);
  }

  private onSpotifyPlayerNotReady(resolve, webPlaybackPlayer) {
    console.log('Spot player Device ID has gone offline: ', webPlaybackPlayer.device_id);
    resolve(false);
  }

  private onSpotifyPlayerPlaybackError(resolve, message) {
    console.error('Spot player playback error: ', message);
    resolve(false);
  }

  private onSpotifyPlayerReady(resolve, webPlaybackPlayer) {
    this.deviceId = webPlaybackPlayer.device_id;
    console.log('Spotify player ready. Device ID: ', this.deviceId);
    resolve(true);
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
          device_id: this.deviceId
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
    localStorage.setItem('spotifyToken', spotifyCookie.accessToken);
    this.token = spotifyCookie.accessToken;
  }

  private setDeviceId(deviceId: string) {
    this._deviceId = deviceId;
  }
}
