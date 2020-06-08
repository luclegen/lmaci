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
    price: 0,
    quantity: { imported: 1 },
    type: 'laptop',
    colors: [],
    sizes: [],
    styles: [],
    editions: [],
    capacitys: [],
    technicalDetails: [],
  };

  color = {
    option: '',
    name: '',
    value: ''
  };

  size;
  sizeSelected;

  style;
  styleSelected;

  edition;
  editionSelected;

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

  onSizeSubmit(form: NgForm) {
    if (this.sizeSelected) {
      this.product.sizes[this.product.sizes.indexOf(this.sizeSelected)] = form.value.size;
      this.sizeSelected = null;
    } else this.product.sizes.push(form.value.size);
    form.resetForm();
  }
  
  onStyleSubmit(form: NgForm) {
    if (this.styleSelected) {
      this.product.styles[this.product.styles.indexOf(this.styleSelected)] = form.value.style;
      this.styleSelected = null;
    } else this.product.styles.push(form.value.style);
    form.resetForm();
  }

  onEditionSubmit(form: NgForm) {
    if (this.editionSelected) {
      this.product.editions[this.product.editions.indexOf(this.editionSelected)] = form.value.edition;
      this.editionSelected = null;
    } else this.product.editions.push(form.value.edition);
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

  onSizeCancel() {
    this.size = this.sizeSelected;
    this.size = '';
    this.sizeSelected = '';
  }

  onStyleCancel() {
    this.style = this.styleSelected;
    this.style = '';
    this.styleSelected = '';
  }

  onEditionCancel() {
    this.edition = this.editionSelected;
    this.edition = '';
    this.editionSelected = '';
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

  onSizeEdit(s: string) {
    this.size = s;
    this.sizeSelected = s;
  }

  onStyleEdit(d: string) {
    this.style = d;
    this.styleSelected = d;
  }

  onEditionEdit(d: string) {
    this.edition = d;
    this.editionSelected = d;
  }

  onCapacityEdit(c: Object) {
    this.capacity = Object(c);
    this.capacitySelected.size = Object(c).size;
    this.capacitySelected.price = Object(c).price;
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

  onRemoveStyle(d: string) {
    if (confirm('Are you sure remove: ' + d + '?')) this.product.styles.splice(this.product.styles.indexOf(d), 1);
  }

  onRemoveEdition(d: string) {
    if (confirm('Are you sure remove: ' + d + '?')) this.product.editions.splice(this.product.editions.indexOf(d), 1);
  }

  onRemoveCapacity(c: Object) {
    if (confirm('Are you sure remove: ' + JSON.stringify(c) + '?')) this.product.capacitys.splice(this.product.capacitys.indexOf(Object(c)), 1);
  }

  onRemoveTechnicalDetail(t: Object) {
    if (confirm('Are you sure remove: ' + JSON.stringify(t) + '?')) this.product.technicalDetails.splice(this.product.technicalDetails.indexOf(Object(t)), 1);
  }

  //#endregion Remove

}
