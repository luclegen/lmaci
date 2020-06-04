import { Component, OnInit } from '@angular/core';

import { Product } from 'src/app/models/product.model';
import { AdminService } from 'src/app/services/admin.service';

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
    type: 'laptop',
    description: '',
    colors: [],
    technicalDetails: [],
    post: '',
  }

  constructor() { }

  ngOnInit(): void {
  }

}
