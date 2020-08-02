import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SignalrService } from '../services/signalr.service';
import { ChatComponent } from './chat/chat.component';
import { GlobalRoomComponent } from './global-room/global-room.component';
import { LoginComponent } from './user/login/login.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './user/register/register.component';
import { UserService } from 'src/services/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { PrivateRoomComponent } from './home/private-room/private-room.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    GlobalRoomComponent,
    LoginComponent,
    UserComponent,
    RegisterComponent,
    HomeComponent,
    PrivateRoomComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule
  ],
  providers: [SignalrService, UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
