import { Injectable } from '@angular/core';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class ContentCreatorService {
  private _lessons: Lesson[];

  constructor() {
    this._lessons = [];
  }

  get lessons(): Lesson[] {
    return this._lessons;
  }

  createLesson(lesson: Lesson) {
    this.lessons.push(lesson);
    console.log(this.lessons);
  }
}
