import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SpotifyService } from 'src/app/shared/services/spotify.service';

@Component({
  selector: 'app-track-form',
  templateUrl: 'track-form.component.html',
  styleUrls: ['track-form.component.scss']
})
export class TrackFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  trackNameSub: Subscription;

  constructor(private spotifyServ: SpotifyService) { }

  ngOnInit() {
    this.trackNameSub = this.form.get('trackName').valueChanges.subscribe(
      (trackName: string) => {
        this.spotifyServ.searchTrack(trackName).subscribe(response => console.log(response));
      }
    );
  }

  ngOnDestroy() {
    this.trackNameSub.unsubscribe();
  }
}
