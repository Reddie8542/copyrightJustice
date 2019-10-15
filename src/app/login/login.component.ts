import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, Form } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SpotifyService } from '../shared/services/spotify.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ContentCreatorService } from '../shared/services/content-creator.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  contentCreatorForm: FormGroup;
  showContentCreatorForm = false;

  constructor(private router: Router,
              private ccService: ContentCreatorService,
              private spotifyService: SpotifyService) {}

  ngOnInit() {
    this.contentCreatorForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onContentCreatorSignIn() {
    const username: string = this.contentCreatorForm.value.username;
    const password: string = this.contentCreatorForm.value.password;
    console.log(username, password);
    this.ccService.signIn(username, password);
    this.router.navigate(['/content-creator', 'lesson-builder']);
  }

  onSpotifyClick() {
    // this.spotifyService.signIn().subscribe(response => console.log(response));
    this.router.navigate(['/lesson'], { queryParamsHandling: 'preserve' });
  }
}
