import { Component, OnInit, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { Product } from 'src/app/models/product.model';

import { HelperService } from 'src/app/services/helper.service';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {

  //#region Product

  product = {
    _id: '',
    img: { index: -1, path: ''},
    name: '',
    price: 0,
    quantity: { imported: 0 },
    type: '',
    colors: [],
    properties: [],
    technicalDetails: [],
  };

  products = [];

  //#endregion Product

  keyword;

  //#region Img

  imageChangedEvent: any = '';
  croppedImage: any = '';

  //#endregion Img

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

  //#region Regex

  NotNegativeNumberRegex;

  //#endregion Regex

  @HostListener('window:resize')
  onResize() {
    this.ngOnInit();
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    return this.canDeactivate();
  }

  constructor(private titleService: Title,
              private helperService: HelperService,
              private adminService: AdminService,
              private router: Router) {
    this.titleService.setTitle('Products Management | Lmaci');
    this.NotNegativeNumberRegex = this.helperService.NotNegativeNumberRegex;
  }

  ngOnInit(): void {
    setTimeout(() => {
      const vpWidth = document.documentElement.clientWidth;
      const tableWidth = vpWidth * (0.45 * 0.94);
      const colorTable = document.querySelector('.color-table') as HTMLElement;
      const tripleIn = document.getElementsByClassName('triple') as HTMLCollectionOf<HTMLElement>;
      const doubleIn = document.getElementsByClassName('double') as HTMLCollectionOf<HTMLElement>;
      const functions = document.getElementsByClassName('functions') as HTMLCollectionOf<HTMLElement>;
      const input = document.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;
      const label = document.getElementsByTagName('label') as HTMLCollectionOf<HTMLLabelElement>;
      const select = document.getElementsByTagName('select') as HTMLCollectionOf<HTMLSelectElement>;
      const price = document.getElementById('price') as HTMLElement;
      const priceIn = document.getElementById('price-in') as HTMLElement;
      const quantityImported = document.getElementById('quantity-imported') as HTMLElement;
      const quantityImportedIn = document.getElementById('quantity-imported-in') as HTMLElement;
      const type = document.getElementById('type') as HTMLElement;
      const typeSelect = document.getElementById('type-select') as HTMLElement;

      colorTable.style.width = tableWidth + 'px';

      tripleIn[0].style.width = (tableWidth - (functions[0].clientWidth + 3) - 256) + 'px';

      for (let i = 0; i < doubleIn.length; i++) doubleIn[i].style.width = ((tableWidth - (functions[1].clientWidth + 3)) * 0.5 - 20) + 'px';

      for (let i = 0; i < input.length; i++) input[i].style.fontSize = vpWidth * 0.015 + 'px';
      for (let i = 0; i < label.length; i++) label[i].style.fontSize = vpWidth * 0.015 + 'px';
      for (let i = 0; i < select.length; i++) select[i].style.fontSize = vpWidth * 0.015 + 'px';

      price.style.marginLeft = (priceIn.offsetWidth - price.offsetWidth) + 'px';
      quantityImported.style.marginLeft = (quantityImportedIn.offsetWidth - quantityImported.offsetWidth) + 'px';
      type.style.marginLeft = (typeSelect.offsetWidth - type.offsetWidth) + 'px';
    });

    this.adminService.getProducts().subscribe(res => this.products = res['products'], err => alert(err.error.msg));
  }

  //#region Can Deactive

  canDeactivate() {
    return !(this.imageChangedEvent || this.product.name || this.product.price || this.product.quantity.imported || this.product.type || this.product.colors.length || this.product.properties.length || this.product.technicalDetails.length || this.color.option || this.color.name || this.color.value || this.property.name || this.property.options.length || this.option.value || this.option.price || this.technicalDetail.name || this.technicalDetail.value);
  }

  //#endregion Can Deactive

  //#region Img Cropper

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  //#endregion Img Cropper

  //#region Submit

  onSubmit(form: NgForm) {
    if (form.value._id) {
      form.value.img = '';

      if (this.croppedImage) {
        this.adminService.updateProduct(form.value._id, form.value).subscribe(
          res => {
            const formData = new FormData();

            this.product.img.index++;
            const file = new File([ this.helperService.base64ToBlob(this.croppedImage, 'png') ], 'img.png', { type: 'image/png' });
            
            formData.append('index', this.product.img.index.toString());
            formData.append('file', file, this.product.img.index.toString() + '.png');

            this.adminService.uploadProductImg(res['_id'], formData).subscribe(
              res => {
                alert('Update this product is successfully!');

                this.product = {
                  _id: '',
                  img: { index: -1, path: ''},
                  name: '',
                  price: 0,
                  quantity: { imported: 0 },
                  type: '',
                  colors: [],
                  properties: [],
                  technicalDetails: [],
                };

                this.imageChangedEvent = this.croppedImage = '';
                this.ngOnInit();
              },  
              err => alert(err.error.msg)
            );
          },
          err => alert(err.error.msg)
        );
      } else {
        this.adminService.updateProduct(form.value._id, form.value).subscribe(
          res => {
            alert('Update this product is successfully!');

            this.product = {
              _id: '',
              img: { index: -1, path: ''},
              name: '',
              price: 0,
              quantity: { imported: 0 },
              type: '',
              colors: [],
              properties: [],
              technicalDetails: [],
            };

            this.imageChangedEvent = this.croppedImage = '';
            this.ngOnInit();
          },
          err => alert(err.error.msg)
        );
      }
    } else {
      this.adminService.createProduct(form.value).subscribe(
        res => {
          const formData = new FormData();

          this.product.img.index++;
          const file = new File([ this.helperService.base64ToBlob(this.croppedImage, 'png') ], 'img.png', { type: 'image/png' });

          formData.append('index', this.product.img.index.toString());
          formData.append('file', file, this.product.img.index.toString() + '.png');

          this.adminService.uploadProductImg(res['_id'], formData).subscribe(
            res => {
              alert('Create this product is successfully!');

              this.product = {
                _id: '',
                img: { index: -1, path: ''},
                name: '',
                price: 0,
                quantity: { imported: 0 },
                type: '',
                colors: [],
                properties: [],
                technicalDetails: [],
              };

              this.imageChangedEvent = this.croppedImage = '';
              this.ngOnInit();
            },  
            err => alert(err.error.msg)
          );
        },
        err => alert(JSON.stringify(err.error))
      );
    }
  }

  onSubmitColor(form: NgForm) {
    const colors = {
      '#ffffff': 'White',
      '#c0c0c0': 'Silver',
      '#808080': 'Gray',
      '#000000': 'Black',
      '#ff0000': 'Red',
      '#800000': 'Maroon',
      '#ffff00': 'Yellow',
      '#ffd700': 'Gold',
      '#808000': 'Olive',
      '#00ff00': 'Lime',
      '#008000': 'Green',
      '#00ffff': 'Aqua',
      '#008080': 'Teal',
      '#0000ff': 'Blue',
      '#000080': 'Navy',
      '#ff00ff': 'Fuchsia',
      '#800080': 'Purple'
    }

    if (form.value.option != 'custom') {
      form.value.name = colors[ form.value.option ];
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
      
    this.color = {
      option: '',
      name: '',
      value: ''
    };

    setTimeout(() => this.scroll((document.querySelectorAll('.in-row') as NodeListOf<HTMLElement>)[0], 1/3));
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

    setTimeout(() => this.scroll((document.querySelectorAll('.in-row') as NodeListOf<HTMLElement>)[1], 3/5));
  }

  onSubmitOption() {
    if (this.optionSelected.value && this.optionSelected.price >= 0 ) {
      this.property.options[this.property.options.indexOf(this.optionSelected)] = this.option;

      this.optionSelected = {
        value: '',
        price: 0
      }

      this.optionTmp = {
        value: '',
        price: 0
      }
    } else this.property.options.push(this.option);

    this.option = {
      value: '',
      price: 0
    }

    setTimeout(() => this.scroll((document.querySelector('#option-in-row') as HTMLElement), 3/5));
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

    setTimeout(() => this.scroll((document.querySelectorAll('.in-row') as NodeListOf<HTMLElement>)[2], 9/10));
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

  onCancelProduct() {
    if (confirm('Are you sure to cancel?')) {
      this.product = {
        _id: '',
        img: { index: -1, path: ''},
        name: '',
        price: 0,
        quantity: { imported: 0 },
        type: '',
        colors: [],
        properties: [],
        technicalDetails: [],
      };
  
      this.imageChangedEvent = this.croppedImage = '';
      this.ngOnInit();
    }
  }

  //#endregion Cancel

  //#region Edit

  onEditColor(c: Object) {
    this.color = this.colorSeleted = Object(c);
    this.colorTmp = JSON.parse(JSON.stringify(c));
  }

  onEditProperty(p: Object) {
    this.property = this.propertySelected = Object(p);
    this.propertyTmp = JSON.parse(JSON.stringify(p));
  }

  onEditOption(o: Object) {
    this.option = this.optionSelected = Object(o);
    this.optionTmp = JSON.parse(JSON.stringify(o));
  }

  onEditTechnicalDetail(t: Object) {
    this.technicalDetail = this.technicalDetailSelected = Object(t);
    this.technicalDetailTmp = JSON.parse(JSON.stringify(t));
  }

  onEditProduct(p: Object) {
    this.adminService.getProducts().subscribe(res => {
      const index = this.products.indexOf(p);

      this.products = res['products'];
      this.product = this.products[index];
      this.imageChangedEvent = this.croppedImage = '';
    }, err => alert(err.error.msg));
  }

  //#endregion Edit

  //#region Delete

  onDeleteColor(c: String) {
    if (confirm('Are you sure delete: ' + JSON.stringify(c) + '?')) this.product.colors.splice(this.product.colors.indexOf(Object(c)), 1);
  }

  onDeleteProperty(p: Object) {
    if (confirm('Are you sure delete: ' + JSON.stringify(p) + '?')) this.product.properties.splice(this.product.properties.indexOf(Object(p)), 1);
  }

  onDeleteOption(o: Object) {
    if (confirm('Are you sure delete: ' + JSON.stringify(o) + '?')) this.property.options.splice(this.property.options.indexOf(Object(o)), 1);
  }

  onDeleteTechnicalDetail(t: Object) {
    if (confirm('Are you sure delete: ' + JSON.stringify(t) + '?')) this.product.technicalDetails.splice(this.product.technicalDetails.indexOf(Object(t)), 1);
  }

  onDeleteProduct(p: Product) {
    if (confirm('Are you sure delete: ' + JSON.stringify(p) + '?')) {
      this.adminService.deleteProduct(p._id).subscribe(res => alert(res['msg']), err => alert(err.error.msg));
      this.ngOnInit();
    }
  }

  //#endregion Delete

  //#region Check

  isNotSubmitProperty() {
    return this.property.options.some(o => !o.value || o.price == null || o.price < 0);
  }

  //#endregion Check

  //#region Products

  onSearch(form: NgForm) {
    this.adminService.searchProducts(form.value).subscribe(res => this.products = res['products'], err => alert(err.error.msg));
  }

  showAll() {
    this.ngOnInit();
  }

  viewDetails(event: any, product: Product) {
    if (event.ctrlKey) window.open(product.type + '/' + product._id);
    else this.router.navigateByUrl(product.type + '/' + product._id);
  }

  //#endregion Products

  //#region Scroll

  scroll(el: HTMLElement, scale: number) {
    const fullyVisible = el => {
      var top = el.offsetTop;
      var left = el.offsetLeft;
      var width = el.offsetWidth;
      var height = el.offsetHeight;

      while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
      }
      console.log(window.pageYOffset);

      return top >= window.pageYOffset && top + height <= window.pageYOffset + window.innerHeight && left >= window.pageXOffset && left + width <= window.pageXOffset + window.innerWidth;
    }

    if (!fullyVisible(el)) {
      window.scroll(0, 0);
      window.scroll(0, el.getBoundingClientRect().bottom - document.documentElement.clientHeight * scale);
    }
  }

  //#endregion Scroll

}
