import { Component, OnInit } from '@angular/core';
import { Lesson } from 'src/app/shared/models/lesson.model';
import { ContentCreatorService } from 'src/app/shared/services/content-creator.service';

@Component({
  selector: 'app-my-lessons',
  templateUrl: 'my-lessons.component.html',
  styleUrls: ['my-lessons.component.scss']
})
export class MyLessonsComponent implements OnInit {
  lessons: Lesson[];

  constructor(private ccService: ContentCreatorService) { }

  ngOnInit() {
    this.lessons = this.ccService.lessons;
  }
}
