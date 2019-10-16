import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LessonComponent } from './lesson/lesson.component';
import { RegisterComponent } from './register/register.component';
import { ContentCreatorComponent } from './content-creator/content-creator.component';
import { LessonBuilderComponent } from './content-creator/components/lesson-builder/lesson-builder.component';
import { SpotifyAuthGuard } from './shared/guards/spotify-auth.guard';
import { ContentCreatorLoginComponent } from './login/content-creator/content-creator-login.component';


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
    component: LessonComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'content-creator',
    canActivate: [SpotifyAuthGuard],
    children: [
      { path: 'lesson-builder', component: LessonBuilderComponent }
    ],
    component: ContentCreatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
