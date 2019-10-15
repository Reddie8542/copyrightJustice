import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentCreatorService {
  private _isAuth: boolean;
  $authenticated = new Subject<boolean>();

  constructor() {
    this._isAuth = false;
    this.$authenticated.next(false);
  }

  get isAuth() {
    return this._isAuth;
  }

  set isAuth(isAuth: boolean) {
    this._isAuth = isAuth;
  }

  signIn(username: string, password: string): void {
    this.isAuth = true;
    this.$authenticated.next(true);
  }

  signOut() {
    this.isAuth = false;
    this.$authenticated.next(false);
  }
}
