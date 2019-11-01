
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private readonly BASE_URL = 'https://www.googleapis.com/youtube/v3/';
  private readonly VIDEOS_ENDPOINT = 'videos';
  private readonly API_KEY = 'AIzaSyA540XnkythztJ17iEUTlmLuI6unSpfIxc';
  // tslint:disable-next-line: variable-name
  private _player: any;
  // tslint:disable-next-line: variable-name
  private _YouTube: any;
  private _playerStateChanges: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) { }

  get player(): any {
    return this._player;
  }

  set player(player: any) {
    this._player = player;
  }

  get playerStateChanges$(): Observable<any> {
    return this._playerStateChanges.asObservable();
  }

  get YouTube(): any {
    return this._YouTube;
  }

  set YouTube(YouTube: any) {
    this._YouTube = YouTube;
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

  initializePlayer(videoId: string, toAttachId: string) {
    (window as any).onYouTubeIframeAPIReady = () => {
      this.YouTube = (window as any).YT;
      this.player = new this.YouTube.Player(toAttachId, {
        height: '100%',
        width: '100%',
        videoId,
        playerVars: {
          autoplay: 0,
          rel: 0,
          controls: 2,
          origin: 'http://localhost:4200'
        },
        events: {
          onReady: this.onYouTubePlayerReady.bind(this),
          onStateChange: (state) => this.playerStateChanges.next(state)
        }
      });
    };
  }

  attachYoutubeIframeAPI() {
    const doc = (window as any).document;
    // tslint:disable-next-line: prefer-const
    let playerApiScript = doc.createElement('script');
    playerApiScript.type = 'text/javascript';
    playerApiScript.src = 'https://www.youtube.com/iframe_api';
    doc.body.appendChild(playerApiScript);
  }

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

  private onYouTubePlayerReady(event) {
    console.log('YouTube player ready!', event);
  }
}
