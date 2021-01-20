import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

import { ProductsComponent } from 'src/app/components/body/admin/products/products.component';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanDeactivate<ProductsComponent> {

  constructor(private authService: AuthService) { }

  canActivate(): boolean {
    return this.authService.loggedIn() && this.authService.activated() && this.authService.isAdmin();
  }

  canDeactivate(productsComponent: ProductsComponent) {
    return productsComponent.isInput ? confirm('Leave site?\nChanges you made may not be saved.') : true;
  }

}
