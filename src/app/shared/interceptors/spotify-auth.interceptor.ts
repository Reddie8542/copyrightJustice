import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpotifyService } from '../services/spotify.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class SpotifyAuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private spotifyServ: SpotifyService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(SpotifyService.WEB_API_BASE_URL)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.spotifyServ.authToken}`
        }
      });
    }
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => { },
        (error: any) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.spotifyServ.deleteAuthToken();
            this.router.navigate(['/login', 'viewer']);
          }
        }
      )
    );
  }
}
