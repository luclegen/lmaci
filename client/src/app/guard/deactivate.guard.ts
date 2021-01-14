import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsComponent } from '../components/body/admin/products/products.component';

@Injectable({
  providedIn: 'root'
})
export class DeactivateGuard implements CanDeactivate<ProductsComponent> {
  canDeactivate(productsComponent: ProductsComponent) {
    return productsComponent.isInput ? confirm('Leave site?\nChanges you made may not be saved.') : true;
  }
}
