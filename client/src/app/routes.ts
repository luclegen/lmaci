import { Routes } from '@angular/router';

import { AuthGuard } from './guards/auth/auth.guard';
import { AdminGuard } from './guards/admin/admin.guard';
import { UserGuard } from './guards/user/user.guard';

import { HomeComponent } from './components/body/home/home.component';
import { UserComponent } from './components/body/user/user.component';
import { RegisterComponent } from './components/body/auth/register/register.component';
import { LoginComponent } from './components/body/auth/login/login.component';
import { ActiveComponent } from './components/body/auth/active/active.component';
import { ChangeEmailComponent } from './components/body/auth/change-email/change-email.component';
import { FindUsernameComponent } from './components/body/auth/find-username/find-username.component';
import { ResetPasswordComponent } from './components/body/auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './components/body/auth/change-password/change-password.component';
import { AdminComponent } from './components/body/admin/admin.component';
import { UsersComponent } from './components/body/admin/users/users.component';
import { ProductsComponent } from './components/body/admin/products/products.component';
import { AdminsComponent } from './components/body/admin/admins/admins.component';
import { ProductComponent } from './components/body/product/product.component';
import { ProductListComponent } from './components/body/product-list/product-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'active', component: ActiveComponent, canActivate: [AuthGuard] },
  { path: 'change-email', component: ChangeEmailComponent, canActivate: [AuthGuard] },
  { path: 'find-username', component: FindUsernameComponent },
  { path: 'reset-password/:username', component: ResetPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard],
    children: [ { path: 'admins', component: AdminsComponent },
                { path: 'users', component: UsersComponent },
                { path: 'products', component: ProductsComponent, canDeactivate: [AdminGuard] } ] },
  { path: 'user/:username', component: UserComponent, canActivate: [UserGuard] },
  { path: ':path', component: ProductListComponent },
  { path: ':type/:id', component: ProductComponent }
]
