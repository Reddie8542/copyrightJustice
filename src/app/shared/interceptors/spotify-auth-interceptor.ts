import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SpotifyAuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Is my request intercepted?');
    // const req = request.url.includes('spotify') ? request.clone({
    //   setHeaders: {
    //     'Content-Type' : 'application/json; charset=utf-8',
    //     'Accept'       : 'application/json',
    //     'Authorization': 'Bearer test' ,
    //   }
    // }) : request;
    return next.handle(request);
  }
}
