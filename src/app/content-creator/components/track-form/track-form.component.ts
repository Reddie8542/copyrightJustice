import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SpotifyService } from 'src/app/shared/services/spotify.service';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-track-form',
  templateUrl: 'track-form.component.html',
  styleUrls: ['track-form.component.scss']
})
export class TrackFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  tracks: Array<any>;
  trackNameSub: Subscription;

  constructor(private spotifyServ: SpotifyService) { }

  ngOnInit() {
    this.trackNameSub = this.form.get('trackName').valueChanges.pipe(
      debounceTime(1000),
      switchMap((trackName: string) => this.spotifyServ.searchTrack(trackName))
    ).subscribe(response => console.log('Tracks: ', response));
  }

  ngOnDestroy() {
    this.trackNameSub.unsubscribe();
  }
}
