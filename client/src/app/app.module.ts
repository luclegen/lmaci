// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

// Syncfusion
import { RichTextEditorAllModule } from "@syncfusion/ej2-angular-richtexteditor";
import { DialogModule } from "@syncfusion/ej2-angular-popups";
import { ButtonModule } from "@syncfusion/ej2-angular-buttons";

// Routes
import { routes } from './routes';

// Authentication
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';

// Services
import { UserService } from './services/user.service';

// Tools
import { ImageCropperModule } from 'ngx-image-cropper';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TopNavbarComponent } from './components/header/top-navbar/top-navbar.component';
import { HomeComponent } from './components/body/home/home.component';
import { UserComponent } from './components/body/user/user.component';
import { RegisterComponent } from './components/body/auth/register/register.component';
import { LoginComponent } from './components/body/auth/login/login.component';
import { ActiveComponent } from './components/body/auth/active/active.component';
import { ProfileComponent } from './components/body/user/profile/profile.component';
import { ChangeEmailComponent } from './components/body/auth/change-email/change-email.component';
import { FindUsernameComponent } from './components/body/auth/find-username/find-username.component';
import { ResetPasswordComponent } from './components/body/auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './components/body/auth/change-password/change-password.component';
import { AdminComponent } from './components/body/admin/admin.component';
import { UsersComponent } from './components/body/admin/users/users.component';
import { ProductsComponent } from './components/body/admin/products/products.component';
import { AdminsComponent } from './components/body/admin/admins/admins.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TopNavbarComponent,
    HomeComponent,
    UserComponent,
    RegisterComponent,
    LoginComponent,
    ActiveComponent,
    ProfileComponent,
    ChangeEmailComponent,
    FindUsernameComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    AdminComponent,
    UsersComponent,
    ProductsComponent,
    AdminsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RichTextEditorAllModule,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ImageCropperModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, AuthGuard, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
