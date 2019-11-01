import { Component, OnInit } from '@angular/core';
import { SpotifyService } from './shared/services/spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'copyrightJustice';

  constructor(private spotService: SpotifyService) { }

  ngOnInit() {
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify Player SDK is ready!');
      this.spotService.isWebPlaybackSDKReady = true;
    };
  }
}
