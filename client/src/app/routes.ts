import { Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { HomeComponent } from './components/body/home/home.component';
import { UserComponent } from './components/body/user/user.component';
import { ProfileComponent } from './components/body/user/profile/profile.component';
import { RegisterComponent } from './components/body/auth/register/register.component';
import { LoginComponent } from './components/body/auth/login/login.component';
import { ActiveComponent } from './components/body/auth/active/active.component';

export const routes: Routes = [
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
    path: 'user', component: UserComponent,
    children: [ { path: ':username', component: ProfileComponent, canActivate: [AuthGuard] } ]
  },
  {
    path: '', pathMatch: 'full', component: HomeComponent
  }
]