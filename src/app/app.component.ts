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
   this.spotService.initializePlayer();
  }
}
