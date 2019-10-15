import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { VideoStartFormErrorMatcher } from './video-start-form.error-matcher';

@Component({
  selector: 'app-video-start-form',
  templateUrl: 'video-start-form.component.html',
  styleUrls: ['video-start-form.component.scss']
})
export class VideoStartFormComponent implements OnInit {
  @Input() form: FormGroup;
  matcher: VideoStartFormErrorMatcher;

  ngOnInit() {
    this.matcher = new VideoStartFormErrorMatcher();
  }
}
