import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {

  product = {
    _id: '',
    name: '',
    status: '',
    quantity: { imported: 0 },
    price: 0,
    type: '',
    description: '',
    colors: [],
    technicalDetails: [],
    post: '',
  }
  // product: Product;
  products: Product[];

  constructor() { }

  ngOnInit(): void {
  }

}
