import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContentCreatorService } from '../services/content-creator.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ContentCreatorAuthGuard implements CanActivate {
  constructor(private ccService: ContentCreatorService,
              private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      const isAuth = this.ccService.isAuth;
      if (!isAuth) {
        this.router.navigate(['/login']);
      }
      return isAuth;
  }
}
