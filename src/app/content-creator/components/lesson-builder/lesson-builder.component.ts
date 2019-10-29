import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors, AbstractControl, FormArray } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Subscription, timer } from 'rxjs';
import { YoutubeService } from 'src/app/shared/services/youtube.service';
import { map, switchMap, filter } from 'rxjs/operators';
import { VideoStartFormComponent } from '../video-start-form/video-start-form.component';
import * as moment from 'moment';
import { Lesson } from 'src/app/shared/models/lesson.model';
import { ContentCreatorService } from 'src/app/shared/services/content-creator.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lesson-builder',
  templateUrl: 'lesson-builder.component.html',
  styleUrls: ['lesson-builder.component.scss']
})
export class LessonBuilderComponent implements OnInit, OnDestroy {
  form: FormGroup;
  videoUrl: SafeResourceUrl;
  videoIdSub: Subscription;
  videoLength: number;

  constructor(private fb: FormBuilder,
              private ccService: ContentCreatorService,
              private sanitizer: DomSanitizer,
              private router: Router,
              private youtubeServ: YoutubeService) { }

  ngOnInit() {
    this.form = this.fb.group({
      videoId: [null, Validators.required, this.validYoutubeId.bind(this)],
      audioConfigs: this.fb.array([], Validators.required)
    });
    this.videoIdSub = this.form.get('videoId').valueChanges.pipe(
      filter((videoId: string) => videoId.length > 0)
    ).subscribe(
      (videoId: string) => {
        this.emptyAudioConfigArray();
        this.getAudioConfigArray().reset();
        const url = `https://www.youtube.com/embed/${videoId}`;
        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    );
  }

  ngOnDestroy() {
    this.videoIdSub.unsubscribe();
  }

  pushAudioConfigForm() {
    (this.form.get('audioConfigs') as FormArray).push(this.fb.group({
      trackData: this.fb.group({
        trackId: [null, Validators.required],
        trackStart: this.fb.group({
          hours: [null],
          minutes: [null],
          seconds: [null]
        }),
        trackEnd: this.fb.group({
          hours: [null],
          minutes: [null],
          seconds: [null]
        })
      }),
      videoStart: this.fb.group({
        hours: [null],
        minutes: [null],
        seconds: [null]
      }, { validators: [this.requiredDuration.bind(this), this.validDuration.bind(this)] })
    }));
  }

  emptyAudioConfigArray() {
    while (this.getAudioConfigArray().length !== 0) {
      this.getAudioConfigArray().removeAt(0);
    }
  }

  getAudioConfigArray(): FormArray {
    return this.form.get('audioConfigs') as FormArray;
  }

  onSubmit() {
    const lesson: Lesson = {
      videoId: this.form.value.videoId,
      audioConfigs: this.getAudioConfigArray().value
    };
    this.ccService.createLesson(lesson);
    this.router.navigate(['/content-creator', 'lessons']);
  }

  requiredDuration(group: FormGroup): ValidationErrors {
    const hourValue = group.get('hours').value;
    const minuteValue = group.get('minutes').value;
    const secondValue = group.get('seconds').value;
    if ((hourValue == null || hourValue === '')
    && (minuteValue == null || minuteValue === '')
    && (secondValue == null || secondValue === '')) {
      return { requiredDuration: true };
    } else {
      return null;
    }
  }

  validDuration(group: FormGroup): ValidationErrors {
    const hours = Number(group.get('hours').value);
    const minutes = Number(group.get('minutes').value);
    const seconds = Number(group.get('seconds').value);
    const milliseconds = ((hours * 60 * 60 + minutes * 60 + seconds) * 1000);
    return milliseconds < this.videoLength ? null : { validDuration: true };
  }

  validYoutubeId(control: AbstractControl): ValidationErrors {
    return timer(1000).pipe(
      switchMap(
      () => {
        return this.youtubeServ.getVideoDetails(control.value).pipe(
          map((response: any) => {
            if (response.items.length > 0) {
              const isoDuration: string = response.items[0].contentDetails.duration;
              this.videoLength = moment.duration(isoDuration).asMilliseconds();
              this.pushAudioConfigForm();
              return null;
            } else {
              return { validId: true };
            }
          })
        );
      }
    ));
  }
}
