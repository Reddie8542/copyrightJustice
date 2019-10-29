import { Injectable } from '@angular/core';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class ContentCreatorService {
  private _lessons: Lesson[];

  constructor() {
    this._lessons = [];
    const createdLesson = JSON.parse(localStorage.getItem('createdLesson'));
    this._lessons.push(createdLesson);
  }

  get lessons(): Lesson[] {
    return this._lessons;
  }

  getLessonByVideoId(videoId: string): Lesson {
    return this.lessons.find(lesson => lesson.videoId === videoId);
  }

  createLesson(lesson: Lesson) {
    console.log(lesson);
    this.lessons.push(lesson);
    localStorage.setItem('createdLesson', JSON.stringify(lesson));
  }
}
