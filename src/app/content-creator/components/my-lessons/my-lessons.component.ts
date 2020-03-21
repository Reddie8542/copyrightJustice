import { Component, OnInit } from '@angular/core';
import { Lesson } from 'src/app/shared/models/lesson.model';
import { ContentCreatorService } from 'src/app/shared/services/content-creator.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-lessons',
  templateUrl: 'my-lessons.component.html',
  styleUrls: ['my-lessons.component.scss']
})
export class MyLessonsComponent implements OnInit {
  domain: string;
  lessons: Lesson[];

  constructor(private ccService: ContentCreatorService) { }

  ngOnInit() {
    this.domain = environment.domain;
    this.lessons = this.ccService.lessons;
  }
}
