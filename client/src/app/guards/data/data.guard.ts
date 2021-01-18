import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ProductsComponent } from 'src/app/components/body/admin/products/products.component';

@Injectable({
  providedIn: 'root'
})
export class DataGuard implements CanDeactivate<unknown> {
  canDeactivate(productsComponent: ProductsComponent) {
    return productsComponent.isInput ? confirm('Leave site?\nChanges you made may not be saved.') : true;
  }
  
}
