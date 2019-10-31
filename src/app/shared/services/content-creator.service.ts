import { Injectable } from '@angular/core';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class ContentCreatorService {
  // tslint:disable-next-line: variable-name
  private _lessons: Lesson[];

  constructor() {
    this._lessons = JSON.parse(localStorage.getItem('createdLessons'));
    if (this._lessons == null) {
      this._lessons = [];
    }
  }

  get lessons(): Lesson[] {
    return this._lessons.slice();
  }

  getLessonByVideoId(videoId: string): Lesson {
    return this.lessons.find(lesson => lesson.videoId === videoId);
  }

  createLesson(lesson: Lesson) {
    console.log(lesson);
    this._lessons.push(lesson);
    localStorage.setItem('createdLessons', JSON.stringify(this._lessons));
  }
}
