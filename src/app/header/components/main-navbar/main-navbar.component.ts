import { Component, OnInit } from '@angular/core';
import { ContentCreatorService } from 'src/app/shared/services/content-creator.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-navbar',
  templateUrl: 'main-navbar.component.html',
  styleUrls: ['main-navbar.component.scss']
})
export class MainNavbarComponent implements OnInit {
  authenticated: Observable<boolean>;

  constructor(private ccService: ContentCreatorService,
              private router: Router) { }

  ngOnInit() {
    this.authenticated = this.ccService.$authenticated;
  }

  onLogout() {
    this.ccService.signOut();
    this.router.navigateByUrl('/login');
  }
}
