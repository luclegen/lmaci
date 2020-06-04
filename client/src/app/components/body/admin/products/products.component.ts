import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {

  product = {
    name: '',
    quantityImported: 0,
    price: 0,
    type: '',
    description: '',
    colors: '',
    technicalDetails: []
  }
  products;

  constructor() { }

  ngOnInit(): void {
  }

}
