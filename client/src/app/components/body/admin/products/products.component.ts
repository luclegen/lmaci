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
    price: 0,
    quantity: { imported: 1 },
    type: 'laptop',
    colors: [ 'red', 'yellow' ],
    capacitys: [ { name: '64GB', price: 0 } ],
    technicalDetails: []
  };

  color;
  capacity = {
    name: '',
    price: ''
  };

  constructor(private titleService: Title) {
    this.titleService.setTitle('Products Management | Lmaci');
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    alert(JSON.stringify(form.value));
  }

  onColorSubmit(form: NgForm) {
    this.product.colors.push(form.value.color);
  }

  onCapacitySubmit(form: NgForm) {
    alert(JSON.stringify(form.value));
    this.product.capacitys.push(form.value);
  }

  removeColor(c: String) {
    this.product.colors.splice(this.product.colors.indexOf(c.toString()), 1);
  }

  removeCapacity(c: Object) {
    this.product.capacitys.splice(this.product.capacitys.indexOf(Object(c)), 1);
  }

}
