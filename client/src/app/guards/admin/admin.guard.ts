import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

import { ProductsComponent } from 'src/app/components/body/admin/products/products.component';
import { AdminService } from 'src/app/services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanDeactivate<ProductsComponent> {

  constructor(private authService: AuthService, private adminService: AdminService) { }

  canActivate(): boolean {
    return this.authService.loggedIn() && this.authService.activated() && this.authService.isAdmin();
  }

  canDeactivate(productsComponent: ProductsComponent) {
    if (productsComponent.canDeactivate()) return true;
    else if (confirm('Leave site?\nChanges you made may not be saved.')) {
      this.adminService.finishEdit(productsComponent.product);
      return true;
    } else return false;
  }

}
