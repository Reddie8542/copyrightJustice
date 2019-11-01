import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { YoutubeService } from '../services/youtube.service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ContentCreatorService } from '../services/content-creator.service';

@Injectable({
  providedIn: 'root'
})
export class LessonGuard implements CanActivate {
  constructor(private ccService: ContentCreatorService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
      const videoId = route.queryParams.videoId;
      const lesson = this.ccService.getLessonByVideoId(videoId);
      if (lesson != null) {
        return true;
      } else {
        console.error('Could not find any lesson with specified video ID: undefined in query params');
        return false;
      }
  }
}
