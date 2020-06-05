import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';

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
    quantity: { imported: 1 },
    price: 0,
    type: 'laptop',
    colors: [ 'red', 'yellow' ],
    technicalDetails: []
  };

  color;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Products Management | Lmaci');
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    alert(JSON.stringify(form.value));
  }

  // onColorSubmit(form: NgForm) {
  //   this.product.colors.push(form.value.color);
  // }

  removeColor(c: String) {
    this.product.colors.splice(this.product.colors.indexOf(c.toString()), 1);
  }

}
