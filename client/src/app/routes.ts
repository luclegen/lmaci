import { Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

import { HomeComponent } from './components/body/home/home.component';
import { UserComponent } from './components/body/user/user.component';
import { RegisterComponent } from './components/body/user/register/register.component';
import { LoginComponent } from './components/body/user/login/login.component';
import { ActiveComponent } from './components/body/user/active/active.component';
import { ProfileComponent } from './components/body/user/profile/profile.component';

export const routes: Routes = [
  {
    path: 'user', component: UserComponent,
    children: [ { path: 'register', component: RegisterComponent },
                { path: 'login', component: LoginComponent },
                { path: 'active', component: ActiveComponent, canActivate: [AuthGuard] },
                { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] } ]
  },
  {
    path: '', pathMatch: 'full', component: HomeComponent
  }
]