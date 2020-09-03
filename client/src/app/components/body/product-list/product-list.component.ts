import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { HelperService } from 'src/app/services/helper.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent implements OnInit {

  type;
  name;
  products;

  constructor(private route: ActivatedRoute,
              private titleService: Title,
              private productsService: ProductsService,
              private helperService: HelperService) {
    const path = this.route.snapshot.paramMap.get('path').split('-');
    [ this.type, this.name ] = [ path[0], path.slice(1).join(' ') ];

    let title = 'No title';

    switch (this.name) {
      case 'macbook':
        title = 'Macbook';
        break;
        
      case 'ipad':
        title = 'iPad';
        break;

      case 'iphone':
        title = 'iPhone';
        break;
        
      case 'apple watch':
        title = this.helperService.toName(this.name);
        break;
        
      case 'hp':
        title = 'HP ' + this.helperService.toName(this.type);
        break;
        
      case 'oppo':
        title = 'OPPO ' + this.helperService.toName(this.type);
        break;
    
      default:
        title = this.helperService.toName(this.name + ' ' + this.type);
        break;
    }

    this.titleService.setTitle(title + ' | Lmaci ');
  }

  ngOnInit(): void {
    this.productsService.getProducts(this.type, this.name).subscribe(
      res => {
        this.products = res[ 'products' ];
        console.log(this.products);
      },
      err => {
        console.warn(err.error.msg);
      }
    );
  }

}
