import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LessonComponent } from './lesson/lesson.component';
import { RegisterComponent } from './register/register.component';
import { ContentCreatorComponent } from './content-creator/content-creator.component';
import { LessonBuilderComponent } from './content-creator/components/lesson-builder/lesson-builder.component';
import { SpotifyAuthGuard } from './shared/guards/spotify-auth.guard';
import { ContentCreatorLoginComponent } from './login/content-creator/content-creator-login.component';
import { MyLessonsComponent } from './content-creator/components/my-lessons/my-lessons.component';
import { LessonGuard } from './shared/guards/lesson.guard';
import { SpotifyPlayerResolver } from './shared/resolvers/spotify-player.resolver';
import { SpotifyPlaybackSDKGuard } from './shared/guards/spotify-playback-sdk.guard';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login/viewer' },
  {
    path: 'login',
    children: [
      {
        path: 'viewer',
        component: LoginComponent
      },
      {
        path: 'content-creator',
        component: ContentCreatorLoginComponent
      }
    ]
  },
  {
    path: 'lesson',
    canActivate: [LessonGuard, SpotifyAuthGuard, SpotifyPlaybackSDKGuard],
    component: LessonComponent,
    resolve: {
      playerInitCorrectly: SpotifyPlayerResolver
    }
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'content-creator',
    canActivate: [SpotifyAuthGuard],
    children: [
      { path: 'lesson-builder', component: LessonBuilderComponent },
      { path: 'lessons', component: MyLessonsComponent }
    ],
    component: ContentCreatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
