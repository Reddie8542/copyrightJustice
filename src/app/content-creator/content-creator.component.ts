import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-creator',
  templateUrl: 'content-creator.component.html',
  styleUrls: ['content-creator.component.scss']
})
export class ContentCreatorComponent implements OnInit {
  tabs: { label: string, route: string }[];

  ngOnInit() {
    this.tabs = [
      { label: 'Lesson builder', route: 'lesson-builder' },
      { label: 'My lessons', route: 'lessons' }
    ];
  }
}
