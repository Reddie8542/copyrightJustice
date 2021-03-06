import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LessonComponent } from './lesson/lesson.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register/register.component';
import { MainNavbarComponent } from './header/components/main-navbar/main-navbar.component';
import { ContentCreatorComponent } from './content-creator/content-creator.component';
import { LessonBuilderComponent } from './content-creator/components/lesson-builder/lesson-builder.component';
import { VideoStartFormComponent } from './content-creator/components/video-start-form/video-start-form.component';
import { AudioConfigFormComponent } from './content-creator/components/audio-config-form/audio-config-form.component';

@NgModule({
  declarations: [
    AppComponent,
    AudioConfigFormComponent,
    ContentCreatorComponent,
    HeaderComponent,
    LessonBuilderComponent,
    LessonComponent,
    LoginComponent,
    MainNavbarComponent,
    RegisterComponent,
    VideoStartFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatSliderModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
