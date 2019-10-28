import { Injectable } from '@angular/core';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class ContentCreatorService {
  createLesson(lesson: Lesson) {
    console.log(lesson);
  }
}
