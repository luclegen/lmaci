import { Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { HomeComponent } from './components/body/home/home.component';
import { UserComponent } from './components/body/user/user.component';
import { ProfileComponent } from './components/body/user/profile/profile.component';
import { RegisterComponent } from './components/body/auth/register/register.component';
import { LoginComponent } from './components/body/auth/login/login.component';
import { ActiveComponent } from './components/body/auth/active/active.component';
import { ChangeEmailComponent } from './components/body/auth/change-email/change-email.component';
import { FindUsernameComponent } from './components/body/auth/find-username/find-username.component';
import { ResetPasswordComponent } from './components/body/auth/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: HomeComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'active', component: ActiveComponent, canActivate: [AuthGuard]
  },
  {
    path: 'change-email', component: ChangeEmailComponent, canActivate: [AuthGuard]
  },
  {
    path: 'user', component: UserComponent,
    children: [ { path: ':username', component: ProfileComponent, canActivate: [AuthGuard] } ]
  },
  {
    path: 'find-username', component: FindUsernameComponent
  },
  {
    path: 'reset-password/:username', component: ResetPasswordComponent
  }
]