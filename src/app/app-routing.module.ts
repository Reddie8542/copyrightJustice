import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LessonComponent } from './lesson/lesson.component';
import { RegisterComponent } from './register/register.component';
import { ContentCreatorAuthGuard } from './shared/guards/content-creator-auth.guard';
import { ContentCreatorComponent } from './content-creator/content-creator.component';
import { LessonBuilderComponent } from './content-creator/components/lesson-builder/lesson-builder.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    component: LoginComponent
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
    canActivate: [],
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
