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
    type: '',
    colors: [],
    capacitys: [],
    properties: [],
    technicalDetails: [],
  };

  //#region Color

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

  //#endregion Color

  //#region Property

  property = {
    name: '',
    options: []
  };

  propertySelected = {
    name: '',
    options: []
  };

  propertyTmp = {
    name: '',
    options: []
  };

  //#endregion Property

  //#region Option

  option = {
    value: '',
    price: 0
  }

  optionSelected = {
    value: '',
    price: 0
  }

  optionTmp = {
    value: '',
    price: 0
  }

  //#endregion Option

  //#region Technical detail

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

  //#endregion Technical detail

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

  onSubmitColor(form: NgForm) {
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

  onSubmitProperty(form: NgForm) {
    delete form.value.optionValue;
    delete form.value.optionPrice;

    if (this.propertySelected.name && this.propertySelected.options.length) {
      this.product.properties[this.product.properties.indexOf(this.propertySelected)] = form.value;

      this.propertySelected = {
        name: '',
        options: []
      };
    } else this.product.properties.push(form.value);
    
    this.property = {
      name: '',
      options: []
    };

    this.option = {
      value: '',
      price: 0
    }
  
    this.optionSelected = {
      value: '',
      price: 0
    }
  
    this.optionTmp = {
      value: '',
      price: 0
    }
  }

  onSubmitOption() {
    if (this.optionSelected.value && this.optionSelected.price >= 0 ) {
      this.property.options[this.property.options.indexOf(this.optionSelected)] = this.option;

      this.optionSelected = {
        value: '',
        price: 0
      }
    } else this.property.options.push(this.option);

    this.option = {
      value: '',
      price: 0
    }
  }

  onSubmitTechnicalDetails(form: NgForm) {
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

  onCancelColor() {
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

  onCancelProperty() {
    this.property.name = this.propertyTmp.name;
    this.property.options = this.propertyTmp.options;

    this.property = {
      name: '',
      options: []
    };
  
    this.propertySelected = {
      name: '',
      options: []
    };
  
    this.propertyTmp = {
      name: '',
      options: []
    };

    this.option = {
      value: '',
      price: 0
    }
  
    this.optionSelected = {
      value: '',
      price: 0
    }
  
    this.optionTmp = {
      value: '',
      price: 0
    }
  }

  onCancelOption() {
    this.option.value = this.optionTmp.value;
    this.option.price = this.optionTmp.price;
 
    this.option = {
      value: '',
      price: 0
    }
  
    this.optionSelected = {
      value: '',
      price: 0
    }
  
    this.optionTmp = {
      value: '',
      price: 0
    }
  }

  onCancelTechnicalDetail() {
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

  onEditColor(c: Object) {
    this.color = Object(c);
    this.colorSeleted = Object(c);
    this.colorTmp = JSON.parse(JSON.stringify(c));
  }

  onPropertyEdit(p: Object) {
    this.property = this.propertySelected = Object(p);
    this.propertyTmp = JSON.parse(JSON.stringify(p));
  }

  onOptionEdit(o: Object) {
    this.option = this.optionSelected = Object(o);
    this.optionTmp = JSON.parse(JSON.stringify(o));
  }

  onTechnicalDetailEdit(t: Object) {
    this.technicalDetail = Object(t);
    this.technicalDetailSelected = Object(t);
    this.technicalDetailTmp = JSON.parse(JSON.stringify(t));
  }

  //#endregion Edit

  //#region Remove

  onRemoveColor(c: String) {
    if (confirm('Are you sure remove: ' + JSON.stringify(c) + '?')) this.product.colors.splice(this.product.colors.indexOf(Object(c)), 1);
  }

  onRemoveProperty(p: Object) {
    if (confirm('Are you sure remove: ' + JSON.stringify(p) + '?')) this.product.properties.splice(this.product.properties.indexOf(Object(p)), 1);
  }

  onRemoveOption(o: Object) {
    if (confirm('Are you sure remove: ' + JSON.stringify(o) + '?')) this.property.options.splice(this.property.options.indexOf(Object(o)), 1);
  }

  onRemoveTechnicalDetail(t: Object) {
    if (confirm('Are you sure remove: ' + JSON.stringify(t) + '?')) this.product.technicalDetails.splice(this.product.technicalDetails.indexOf(Object(t)), 1);
  }

  //#endregion Remove

}
