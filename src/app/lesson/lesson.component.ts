import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ContentCreatorService } from '../shared/services/content-creator.service';
import { Lesson } from '../shared/models/lesson.model';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription, timer, concat } from 'rxjs';
import {  map, filter, switchMap, take, tap } from 'rxjs/operators';
import { LessonTimestamp } from '../shared/models/audio-config.model';
import { SpotifyService } from '../shared/services/spotify.service';
import { YoutubeService } from '../shared/services/youtube.service';

@Component({
  selector: 'app-lesson',
  templateUrl: 'lesson.component.html',
  styleUrls: ['lesson.component.scss']
})
export class LessonComponent implements OnInit, AfterViewInit, OnDestroy {
  lesson: Lesson;
  playerSecondSub: Subscription;
  spotPlayerStateSub: Subscription;
  isSpotifyPlayerPaused = true;
  ytPlayerStateSub: Subscription;

  constructor(private ccService: ContentCreatorService,
              private currentRoute: ActivatedRoute,
              private spotService: SpotifyService,
              private youtubeService: YoutubeService) { }

  ngOnInit() {
    const videoId = this.currentRoute.snapshot.queryParams.videoId;
    this.youtubeService.initializePlayer(videoId, 'ytPlayer');
    this.lesson = this.ccService.getLessonByVideoId(videoId);
    this.sortLessonTracks();
    this.spotPlayerStateSub = this.spotService.playerStateChanges$.subscribe(
      state => this.isSpotifyPlayerPaused = state.paused
    );
    this.ytPlayerStateSub = this.youtubeService.playerStateChanges$.subscribe(
      this.onYouTubePlayerStateChange.bind(this)
    );
  }

  ngOnDestroy() {
    this.playerSecondSub.unsubscribe();
    this.spotPlayerStateSub.unsubscribe();
    this.ytPlayerStateSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.youtubeService.attachYoutubeIframeAPI();
  }

  // onYouTubePlayerStateChange(event) {
  //   switch (event.data) {
  //     case this.youtubeService.YouTube.PlayerState.PLAYING:
  //       // Start querying video status each second
  //       const playerSecondChanges$ = interval(200);
  //       this.playerSecondSub = playerSecondChanges$.pipe(
  //         map(value => this.youtubeService.player.getCurrentTime())
  //       ).subscribe(secsSinceStarted => {
  //         const audioConfig = this.lesson.audioConfigs[0];
  //         const milliSecsSinceStarted = secsSinceStarted * 1000;
  //         const videoStart = this.toMilliseconds(audioConfig.videoStart);
  //         if (milliSecsSinceStarted >= videoStart) {
  //           this.spotService.playTrack(audioConfig.trackData.trackId).subscribe(
  //             response => console.log('Play track response: ', response)
  //           );
  //           this.playerSecondSub.unsubscribe();
  //         }
  //       });
  //       break;
  //     case this.youtubeService.YouTube.PlayerState.BUFFERING:
  //     case this.youtubeService.YouTube.PlayerState.ENDED:
  //     case this.youtubeService.YouTube.PlayerState.PAUSED:
  //       if (this.playerSecondSub != null) {
  //         this.playerSecondSub.unsubscribe();
  //       }
  //       break;
  //   }
  // }

  onYouTubePlayerStateChange(event) {
    switch (event.data) {
      case this.youtubeService.YouTube.PlayerState.PLAYING:
        console.log('Entering case?');
        // Start querying video status each 200ms)
        const playerSecondChanges$ = timer(0, 200).pipe(
          map(value => this.youtubeService.player.getCurrentTime() * 1000)
        );

        const data$ = playerSecondChanges$.pipe(
          map(msSinceStarted => {
            const audioConfig = this.lesson.audioConfigs[0];
            const trackStartAt = this.toMilliseconds(audioConfig.videoStart);
            const trackEnd = this.toMilliseconds(audioConfig.trackData.trackEnd);
            const trackStart = this.toMilliseconds(audioConfig.trackData.trackStart);
            const stopAt = trackStartAt + (trackEnd - trackStart);
            return { audioConfig, msSinceStarted, trackStartAt, stopAt };
          })
        );

        const startPlayingSource$ = data$.pipe(
          filter(data => this.isSpotifyPlayerPaused),
          filter(data => data.msSinceStarted >= data.trackStartAt),
          switchMap(data => this.spotService.playTrack(data.audioConfig.trackData.trackId)),
          tap(response => this.isSpotifyPlayerPaused = false),
          take(1)
        );

        const stopPlayingSource$ = data$.pipe(
          filter(data => data.msSinceStarted >= data.stopAt),
          tap(data => this.spotService.pausePlayer()),
          take(1)
        );

        concat(startPlayingSource$, stopPlayingSource$).subscribe(
          data => console.log('started start stop track logic!', data)
        );
        break;
      case this.youtubeService.YouTube.PlayerState.BUFFERING:
      case this.youtubeService.YouTube.PlayerState.ENDED:
      case this.youtubeService.YouTube.PlayerState.PAUSED:
        if (this.playerSecondSub != null) {
          this.playerSecondSub.unsubscribe();
        }
        break;
    }
  }

  private sortLessonTracks() {
    console.log('Audio configs before sort', this.lesson.audioConfigs);
    this.lesson.audioConfigs = this.lesson.audioConfigs.sort(
      (a, b) => {
        const aStart = this.toMilliseconds(a.videoStart);
        const bStart = this.toMilliseconds(b.videoStart);
        return aStart - bStart;
      }
    );
    console.log('Audio configs after sort', this.lesson.audioConfigs);
  }

  private toMilliseconds(timestamp: LessonTimestamp): number {
    return ((timestamp.hours * 60 * 60 + timestamp.minutes * 60 + timestamp.seconds) * 1000);
  }
}
