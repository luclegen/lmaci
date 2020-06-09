import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
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
    price: 0,
    quantity: { imported: 1 },
    type: 'laptop',
    colors: [],
    capacitys: [],
    properties: [
      {
        name: 'Service Provider',
        values: [ 'A' ]
      },
      {
        name: 'Product grade',
        values: [ 'B', 'C' ]
      }
    ],
    technicalDetails: [],
  };

  color = {
    option: '',
    name: '',
    value: ''
  };

  colorSeleted = {
    option: '',
    name: '',
    value: ''
  };

  colorTmp = {
    option: '',
    name: '',
    value: ''
  };

  capacity = {
    size: 0,
    price: 0
  };

  capacitySelected = {
    size: 0,
    price: 0
  };

  property = {
    name: '',
    values: []
  };

  propertySelected = {
    name: '',
    values: []
  };

  propertyTmp = {
    name: '',
    values: []
  };

  propertyValue;
  propertyValueSelected;

  technicalDetail = {
    name: '',
    value: ''
  };

  technicalDetailSelected = {
    name: '',
    value: ''
  };

  technicalDetailTmp = {
    name: '',
    value: ''
  };

  positiveNumberRegex = /^\d*[1-9]\d*$/;
  NotNegativeNumberRegex = /^\d*[0-9]\d*$/;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Products Management | Lmaci');
  }

  ngOnInit(): void {
  }

  //#region Submit

  onSubmit(form: NgForm) {
    alert(JSON.stringify(form.value));
  }

  onColorSubmit(form: NgForm) {
    if (form.value.option != 'custom') {
      form.value.name = form.value.option[0].toUpperCase() + form.value.option.slice(1);
      form.value.value = form.value.option;
    }

    if (this.colorSeleted.option && this.colorSeleted.name && this.colorSeleted.value) {
      this.product.colors[this.product.colors.indexOf(this.colorSeleted)] = form.value;
      this.colorSeleted = {
        option: '',
        name: '',
        value: ''
      };
    } else this.product.colors.push(form.value);
    form.resetForm();
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

  onPropertySubmit(form: NgForm) {
    delete form.value.propertyValue
    if (this.propertySelected.name && this.propertySelected.values.length) {
      this.product.properties[this.product.properties.indexOf(this.propertySelected)] = form.value;
      this.propertySelected = {
        name: '',
        values: []
      };
    } else this.product.properties.push(form.value);
    
    this.property = {
      name: '',
      values: []
    };
  }

  onPropertyValueSubmit() {
    if (this.propertyValueSelected) {
      this.property.values[this.property.values.indexOf(this.propertyValueSelected)] = this.propertyValue;
      this.propertyValueSelected = '';
    } else this.property.values.push(this.propertyValue);
    this.propertyValue = '';
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

  //#endregion Submit

  //#region Cancel

  onColorCancel() {
    this.color.option = this.colorTmp.option;
    this.color.name = this.colorTmp.name;
    this.color.value = this.colorTmp.value;

    this.color = {
      option: '',
      name: '',
      value: ''
    };

    this.colorSeleted = {
      option: '',
      name: '',
      value: ''
    };

    this.colorTmp = {
      option: '',
      name: '',
      value: ''
    };

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

  onPropertyCancel() {
    this.property.name = this.propertyTmp.name;
    this.property.values = this.propertyTmp.values;

    this.property = {
      name: '',
      values: []
    };

    this.propertySelected = {
      name: '',
      values: []
    };

    this.propertyTmp = {
      name: '',
      values: []
    };

  }

  onPropertyValueCancel() {
    this.propertyValue = this.propertyValueSelected;
    this.propertyValue = '';
    this.propertyValueSelected = '';
  }

  onTechnicalDetailCancel() {
    this.technicalDetail.name = this.technicalDetailTmp.name;
    this.technicalDetail.value = this.technicalDetailTmp.value;
    
    this.technicalDetail = {
      name: '',
      value: ''
    };

    this.technicalDetailSelected = {
      name: '',
      value: ''
    };

    this.technicalDetailTmp = {
      name: '',
      value: ''
    };
  }

  //#endregion Cancel

  //#region Edit

  onColorEdit(c: Object) {
    this.color = Object(c);
    this.colorSeleted = Object(c);
    this.colorTmp.option = Object(c).option;
    this.colorTmp.name = Object(c).name;
    this.colorTmp.value = Object(c).value;
  }

  onCapacityEdit(c: Object) {
    this.capacity = Object(c);
    this.capacitySelected.size = Object(c).size;
    this.capacitySelected.price = Object(c).price;
  }

  onPropertyEdit(p: Object) {
    this.property = Object(p);
    this.propertySelected = Object(p);
    this.propertyTmp = JSON.parse(JSON.stringify(p));
  }

  onPropertyValueEdit(v: string) {
    this.propertyValue = v;
    this.propertyValueSelected = v;
  }

  onTechnicalDetailEdit(t: Object) {
    this.technicalDetail = Object(t);
    this.technicalDetailSelected = Object(t);
    this.technicalDetailTmp.name = Object(t).name;
    this.technicalDetailTmp.value = Object(t).value;
  }

  //#endregion Edit

  //#region Remove

  onRemoveColor(c: String) {
    if (confirm('Are you sure remove: ' + JSON.stringify(c) + '?')) this.product.colors.splice(this.product.colors.indexOf(Object(c)), 1);
  }

  onRemoveCapacity(c: Object) {
    if (confirm('Are you sure remove: ' + JSON.stringify(c) + '?')) this.product.capacitys.splice(this.product.capacitys.indexOf(Object(c)), 1);
  }

  onRemoveProperty(p: Object) {
    // if (confirm('Are you sure remove: ' + s + '?')) this.product.sizes.splice(this.product.sizes.indexOf(s), 1);
  }

  onRemovePropertyValue(v: string) {
    if (confirm('Are you sure remove: ' + v + '?')) this.property.values.splice(this.property.values.indexOf(v), 1);
  }

  onRemoveTechnicalDetail(t: Object) {
    if (confirm('Are you sure remove: ' + JSON.stringify(t) + '?')) this.product.technicalDetails.splice(this.product.technicalDetails.indexOf(Object(t)), 1);
  }

  //#endregion Remove

}
