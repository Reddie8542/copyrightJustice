import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ContentCreatorService } from '../shared/services/content-creator.service';
import { Lesson } from '../shared/models/lesson.model';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { LessonTimestamp } from '../shared/models/audio-config.model';
import { SpotifyService } from '../shared/services/spotify.service';

@Component({
  selector: 'app-lesson',
  templateUrl: 'lesson.component.html',
  styleUrls: ['lesson.component.scss']
})
export class LessonComponent implements OnInit, AfterViewInit, OnDestroy {
  YT: any;
  ytPlayer: any;
  lesson: Lesson;
  playerSecondSub: Subscription;

  constructor(private ccService: ContentCreatorService,
              private currentRoute: ActivatedRoute,
              private spotService: SpotifyService) { }

  ngOnInit() {
    const videoId = this.currentRoute.snapshot.queryParams.videoId;
    this.lesson = this.ccService.getLessonByVideoId(videoId);
    (window as any).onYouTubeIframeAPIReady = () => {
      this.YT = (window as any).YT;
      this.ytPlayer = new this.YT.Player('ytPlayer', {
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
          onStateChange: this.onYouTubePlayerStateChange.bind(this)
        }
      });
    };
    this.spotService.playerStateChanges$.subscribe(
      playerState => {
        console.log('Spotify Player state: ', playerState)
      }
    );
    this.spotService.playTrack(this.lesson.audioConfigs[0].trackData.trackId).subscribe(
      response => console.log(response)
    );
  }

  ngOnDestroy() {
    this.playerSecondSub.unsubscribe();
  }

  ngAfterViewInit() {
    const doc = (window as any).document;
    // tslint:disable-next-line: prefer-const
    let playerApiScript = doc.createElement('script');
    playerApiScript.type = 'text/javascript';
    playerApiScript.src = 'https://www.youtube.com/iframe_api';
    doc.body.appendChild(playerApiScript);
  }

  onYouTubePlayerReady() {
    console.log('YouTube player is ready!');
  }

  onYouTubePlayerStateChange(event) {
    switch (event.data) {
      case this.YT.PlayerState.PLAYING:
        // Start querying video status each second
        const playerSecondChanges$ = interval(200);
        this.playerSecondSub = playerSecondChanges$.pipe(
          map(value => this.ytPlayer.getCurrentTime())
        ).subscribe(secsSinceStarted => {
          const milliSecsSinceStarted = secsSinceStarted * 1000;
          const videoStart = this.toMilliseconds(this.lesson.audioConfigs[0].videoStart);
          if (milliSecsSinceStarted >= videoStart) {
            console.log('Mr Brightside should play now!');
          }
        });
        break;
      case this.YT.PlayerState.BUFFERING:
      case this.YT.PlayerState.ENDED:
      case this.YT.PlayerState.PAUSED:
        if (this.playerSecondSub != null) {
          this.playerSecondSub.unsubscribe();
        }
        break;
    }
  }

  private toMilliseconds(timestamp: LessonTimestamp): number {
    return ((timestamp.hours * 60 * 60 + timestamp.minutes * 60 + timestamp.seconds) * 1000);
  }
}
