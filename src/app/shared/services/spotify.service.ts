import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private readonly AUTH_BASE_URL = 'https://accounts.spotify.com/';
  private readonly WEB_API_BASE_URL = 'https://api.spotify.com/';
  private readonly SCOPES = 'streaming';
  private readonly CJ_CLIENT_ID = '34ada31f63b84648acbc8be0904bcb03';

  constructor(private http: HttpClient) { }

  signIn() {
    const endpoint = 'authorize';
    const url = this.AUTH_BASE_URL + endpoint;
    return this.http.get(url, {
      params: {
        client_id: this.CJ_CLIENT_ID,
        response_type: 'token',
        redirect_uri: 'localhost:4200/lesson',
        scope: this.SCOPES
      }
    });
  }
}
