import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3/';
  private readonly VIDEOS_ENDPOINT = 'videos';
  private readonly API_KEY = 'AIzaSyA540XnkythztJ17iEUTlmLuI6unSpfIxc';

  constructor(private http: HttpClient) { }

  isValidYoutubeId(videoId: string) {
    const url = this.BASE_URL + this.VIDEOS_ENDPOINT;
    const params = {
      part: 'id',
      id: videoId,
      key: this.API_KEY
    };
    return this.http.get(url, { params }).pipe(
      map((response: any) => response.items.length > 0)
    );
  }

  getVideoDetails(videoId: string) {
    const url = this.BASE_URL + this.VIDEOS_ENDPOINT;
    const params = {
      part: 'contentDetails',
      id: videoId,
      key: this.API_KEY
    };
    return this.http.get(url, { params });
  }
}
