import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-navbar',
  templateUrl: 'main-navbar.component.html',
  styleUrls: ['main-navbar.component.scss']
})
export class MainNavbarComponent implements OnInit {
  authenticated: Observable<boolean>;

  constructor(private router: Router) { }

  ngOnInit() { }

  onLogout() {
    this.router.navigateByUrl('/login');
  }
}
