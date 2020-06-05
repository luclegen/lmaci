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
    colors: [ { name: 'Red', value: 'red' } ],
    capacitys: [ { size: 64, price: 0 } ],
    technicalDetails: [ { name: 'Processor', value: 'Intel® Core™ i5-3360M CPU @ 2.80GHz × 4' } ],
    description: [ 'Description' ]
  };

  color = {
    option: '',
    name: '',
    value: ''
  };

  capacity = {
    size: 0,
    price: 0
  };

  technicalDetail = {
    name: '',
    value: ''
  }

  positiveNumberRegex = /^\d*[1-9]\d*$/;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Products Management | Lmaci');
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    alert(JSON.stringify(form.value));
  }

  onColorSubmit(form: NgForm) {
    if (form.value.option != 'custom') {
      form.value.name = form.value.option[0].toUpperCase() + form.value.option.slice(1);
      form.value.value = form.value.option;
    }
    delete form.value.option;
    this.product.colors.push(form.value);
  }

  onCapacitySubmit(form: NgForm) {
    if (form.value.size > 0) this.product.capacitys.push(form.value);
  }

  onTechnicalDetailsSubmit(form: NgForm) {
  }

  removeColor(c: String) {
    this.product.colors.splice(this.product.colors.indexOf(Object(c)), 1);
  }

  removeCapacity(c: Object) {
    this.product.capacitys.splice(this.product.capacitys.indexOf(Object(c)), 1);
  }

  removeTechnicalDetail(t: Object) {
    this.product.technicalDetails.splice(this.product.technicalDetails.indexOf(Object(t)));
  }

}
