import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-lesson',
  templateUrl: 'lesson.component.html',
  styleUrls: ['lesson.component.scss']
})
export class LessonComponent implements OnInit, AfterViewInit {
  player: any;

  ngOnInit() {
    (window as any).onYouTubeIframeAPIReady = () => {
      this.player = new (window as any).YT.Player('ytPlayer', {
        height: '100%',
        width: '100%',
        videoId: 'AaNZBrP26LQ', // Max's video ID
        playerVars: {
          autoplay: 0,
          rel: 0,
          controls: 2,
          origin: 'http://localhost:4200'
        },
        events: {
          onReady: () => {
            console.log('player is ready!');
          },
          onStateChange: () => {
            console.log('onStateChange was executed!');
          }
        }
      });
    };
  }

  ngAfterViewInit() {
    const doc = (window as any).document;
    // tslint:disable-next-line: prefer-const
    let playerApiScript = doc.createElement('script');
    playerApiScript.type = 'text/javascript';
    playerApiScript.src = 'https://www.youtube.com/iframe_api';
    doc.body.appendChild(playerApiScript);
  }
}
