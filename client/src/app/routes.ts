import { Routes } from '@angular/router';

import { HomeComponent } from './components/body/home/home.component';
import { UserComponent } from './components/body/user/user.component';
import { RegisterComponent } from './components/body/user/register/register.component';

export const routes: Routes = [
  {
    path: 'user', component: UserComponent,
    children: [ { path: 'register', component: RegisterComponent } ]
  },
  {
    path: '', pathMatch: 'full', component: HomeComponent
  }
]