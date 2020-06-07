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
    descriptions: [ 'Description' ]
  };

  color = {
    option: '',
    name: '',
    value: ''
  };

  colorSeleted;

  capacity = {
    size: 0,
    price: 0
  };

  capacitySelected = {
    size: 0,
    price: 0
  };

  technicalDetail = {
    name: '',
    value: ''
  };

  technicalDetailSelected = {
    name: '',
    value: ''
  };

  description;
  descriptionSelected;

  positiveNumberRegex = /^\d*[1-9]\d*$/;
  NotNegativeNumberRegex = /^\d*[0-9]\d*$/;

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
    this.product.colors.push(form.value);
  }

  onCapacitySubmit(form: NgForm) {
    if (form.value.size > 0) {
      if ((this.capacitySelected.size > 0)) {
        this.product.capacitys[this.product.capacitys.indexOf(this.capacitySelected)] = form.value;
        this.capacitySelected = {
          size: 0,
          price: 0
        };
      } else this.product.capacitys.push(form.value);
    };
    this.capacity = {
      size: 0,
      price: 0
    };
  }

  onTechnicalDetailsSubmit(form: NgForm) {
    if (this.technicalDetailSelected.name && this.technicalDetailSelected.value) {
      this.product.technicalDetails[this.product.technicalDetails.indexOf(this.technicalDetailSelected)] = form.value;
      this.technicalDetailSelected = {
        name: '',
        value: ''
      };
    } else this.product.technicalDetails.push(form.value);
    form.resetForm();
  }

  onDescriptionSubmit(form: NgForm) {
    if (this.descriptionSelected) {
      this.product.descriptions[this.product.descriptions.indexOf(this.descriptionSelected)] = form.value.description;
      this.descriptionSelected = null;
    } else this.product.descriptions.push(form.value.description);
    form.resetForm();
  }

  onCapacityCancel() {
    this.capacity.size = this.capacitySelected.size;
    this.capacity.price = this.capacitySelected.price;
    this.capacity = {
      size: 0,
      price: 0
    };

    this.capacitySelected = {
      size: 0,
      price: 0
    };
  }

  onCapacityEdit(c: Object) {
    this.capacity = Object(c);
    this.capacitySelected.size = Object(c).size;
    this.capacitySelected.price = Object(c).price;
  }

  onTechnicalDetailEdit(t: Object) {
    this.technicalDetail = Object(t);
    this.technicalDetailSelected.name = Object(t).name;
    this.technicalDetailSelected.value = Object(t).value;
  }

  onDescriptionEdit(d: string) {
    this.description = d;
    this.descriptionSelected = d;
  }

  onRemoveColor(c: String) {
    this.product.colors.splice(this.product.colors.indexOf(Object(c)), 1);
  }

  onRemoveCapacity(c: Object) {
    this.product.capacitys.splice(this.product.capacitys.indexOf(Object(c)), 1);
  }

  onRemoveTechnicalDetail(t: Object) {
    this.product.technicalDetails.splice(this.product.technicalDetails.indexOf(Object(t)), 1);
  }

  onRemoveDescription(d: Object) {
    this.product.descriptions.splice(this.product.descriptions.indexOf(Object(d)), 1);
  }

}
