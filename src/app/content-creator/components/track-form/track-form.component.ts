import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { SpotifyService } from 'src/app/shared/services/spotify.service';
import { debounceTime, switchMap, filter } from 'rxjs/operators';
import { Track } from 'src/app/shared/models/track.model';

@Component({
  selector: 'app-track-form',
  templateUrl: 'track-form.component.html',
  styleUrls: ['track-form.component.scss']
})
export class TrackFormComponent implements OnInit {
  @Input() form: FormGroup;
  tracks: Observable<Track[]>;

  constructor(private spotifyServ: SpotifyService) { }

  ngOnInit() {
    this.tracks = this.form.get('trackName').valueChanges.pipe(
      debounceTime(1000),
      filter((trackName: string) => trackName != null && trackName !== ''),
      switchMap((trackName: string) => this.spotifyServ.searchTracks(trackName))
    );
  }
}
