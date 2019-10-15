import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly AUTH_BASE_URL = 'https://accounts.spotify.com/';
  private readonly WEB_API_BASE_URL = 'https://api.spotify.com/v1/';
  private readonly SCOPES = 'streaming';
  private readonly CJ_CLIENT_ID = '34ada31f63b84648acbc8be0904bcb03';
  private _token: string;

  constructor(private http: HttpClient) { }

  get token(): string {
    return this._token;
  }

  set token(token: string) {
    this._token = token;
  }

  signIn() {
    const endpoint = 'authorize';
    const url = this.AUTH_BASE_URL + endpoint;
    const params = {
      client_id: this.CJ_CLIENT_ID,
      response_type: 'token',
      redirect_uri: 'localhost:4200/lesson',
      scope: this.SCOPES
    };
    return this.http.get(url, { params });
  }

  signInAsContentCreator() {
    const endpoint = 'authorize';
    const url = this.AUTH_BASE_URL + endpoint;
    const params = {
      client_id: this.CJ_CLIENT_ID,
      response_type: 'token',
      redirect_uri: 'localhost:4200/content-creator/lesson-builder'
    };
    return this.http.get(url, { params });
  }

  searchTrack(trackName: string) {
    const endpoint = 'search';
    const url = this.WEB_API_BASE_URL + endpoint;
    const params = {
      q: trackName,
      type: 'track'
    };
    return this.http.get(url, { params });
  }
}
