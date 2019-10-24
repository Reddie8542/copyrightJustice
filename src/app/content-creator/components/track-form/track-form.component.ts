import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import {  Subscription } from 'rxjs';
import { SpotifyService } from 'src/app/shared/services/spotify.service';
import { debounceTime, switchMap, filter } from 'rxjs/operators';
import { Track } from 'src/app/shared/models/track.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TrackFormEndErrorMatcher } from './track-form-end.error-matcher';
import { TrackFormStartErrorMatcher } from './track-form-start.error-matcher';

@Component({
  selector: 'app-track-form',
  templateUrl: 'track-form.component.html',
  styleUrls: ['track-form.component.scss']
})
export class TrackFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  tracks: Track[];
  trackName: Subscription;
  selectedTrackDuration: number;
  endMatcher: TrackFormEndErrorMatcher;
  startMatcher: TrackFormStartErrorMatcher;

  constructor(private spotifyServ: SpotifyService) { }

  ngOnInit() {
    this.endMatcher = new TrackFormEndErrorMatcher();
    this.startMatcher = new TrackFormStartErrorMatcher();
    this.trackName = this.form.get('trackName').valueChanges.pipe(
      debounceTime(1000),
      filter((trackName: string) => trackName != null && trackName !== ''),
      switchMap((trackName: string) => this.spotifyServ.searchTracks(trackName))
    ).subscribe((tracks: Track[]) => this.tracks = tracks);
  }

  ngOnDestroy() {
    this.trackName.unsubscribe();
  }

  onSelectTrack(event: MatAutocompleteSelectedEvent) {
    const trackId = event.option.value;
    const selectedTrack =  this.tracks.find(track => track.id === trackId);
    this.selectedTrackDuration = selectedTrack.duration;
    const trackStartGroup = this.form.get('trackStart');
    const trackEndGroup = this.form.get('trackEnd');
    trackStartGroup.setValidators([this.validStart.bind(this)]);
    trackEndGroup.setValidators([this.validEnd.bind(this)]);
    trackStartGroup.updateValueAndValidity();
    trackEndGroup.updateValueAndValidity();
    console.log('Track selected: ', event);
  }

  private getTrackCheckpoint(checkpoint: string) {
    const group: FormGroup = this.form.get(checkpoint) as FormGroup;
    const hours = Number(group.get('hours').value);
    const minutes = Number(group.get('minutes').value);
    const seconds = Number(group.get('seconds').value);
    const milliseconds = ((hours * 60 * 60 + minutes * 60 + seconds) * 1000);
    return milliseconds;
  }

  private validStart(group: FormGroup): ValidationErrors {
    const trackStart = this.getTrackCheckpoint('trackStart');
    const error = {
      validStart: { message: '' }
    };
    if (trackStart <= 0) {
      error.validStart.message = 'Start time can\' be zero or less than zero';
    } else if (trackStart > this.selectedTrackDuration) {
      error.validStart.message = 'Track can\' start after it has already ended';
    } else {
      return null;
    }
    return error;
  }

  private validEnd(group: FormGroup): ValidationErrors {
    const trackStart = this.getTrackCheckpoint('trackStart');
    const trackEnd = this.getTrackCheckpoint('trackEnd');
    console.log('trackStart in milliseconds', trackStart);
    console.log('trackEnd in milliseconds', trackEnd);
    console.log('Selected track duration', this.selectedTrackDuration);
    if (trackEnd <= 0 || trackEnd > this.selectedTrackDuration || trackEnd < trackStart) {
      return { validEnd: true, message: '' };
    } else {
      return null;
    }
  }
}
