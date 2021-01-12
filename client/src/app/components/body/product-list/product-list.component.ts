import { Component, HostListener, OnInit } from '@angular/core';
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
  title = 'No title';
  items = [];
  index = 0;
  page = [];
  products = [];

  constructor(private route: ActivatedRoute,
              private titleService: Title,
              private productsService: ProductsService,
              private helperService: HelperService) {
    const path = this.route.snapshot.paramMap.get('path').split('-');
    [ this.type, this.name ] = [ path[0], path.slice(1).join(' ') ];

    switch (this.name) {
      case 'macbook':
        this.title = 'Macbook';
        break;
        
      case 'ipad':
        this.title = 'iPad';
        break;

      case 'iphone':
        this.title = 'iPhone';
        break;
        
      case 'apple watch':
        this.title = this.helperService.toName(this.name);
        break;
        
      case 'hp':
        this.title = 'HP ' + this.helperService.toName(this.type);
        break;
        
      case 'oppo':
        this.title = 'OPPO ' + this.helperService.toName(this.type);
        break;
    
      default:
        this.title = this.helperService.toName(this.name + ' ' + this.type);
        break;
    }

    this.titleService.setTitle(this.title + ' | Lmaci ');
  }

  @HostListener('window:resize')
  onResize() {
    this.setContainer();
  }

  ngOnInit(): void {
    this.productsService.getProducts(this.type, this.name).subscribe(
      res => {
        const products = res[ 'products' ];
        
        products.forEach(p => {
          const product = {
            id: p._id,
            path: p.img.path,
            name: p.name,
            price: this.helperService.USDcurrency(p.price),
            star: {
              average: p.reviews.length ? this.helperService.round(this.helperService.average(p.reviews.map(r => r.star)), 1) : 0,
              starCount: [],
              starHalf: false,
              noneStarCount: []
            }
          };

          const number = product.star.average;
          const numberFloored = Math.floor(number);
          const numberRounded = Math.round(number);
          const bias = this.helperService.round(number - numberFloored, 1)

          product.star.starHalf = bias == 0.5;

          for (let i = 0; i < (product.star.starHalf ? numberFloored : numberRounded); i++) product.star.starCount.push('*');
          for (let i = 0; i < 5 - numberRounded; i++) product.star.noneStarCount.push('-');

          this.items.push(product);
        });

        const itemCount = 12;
        const fraction = this.items.length/ itemCount;
        const bias = fraction - Math.floor(fraction);
        const pageCount = bias == 0 ? fraction : Math.floor(fraction) + 1;
        
        for (let i = 0; i < pageCount; i++) this.page.push(this.items.slice(itemCount * i, itemCount * (i + 1)));
      },
      err => console.warn(err.error.msg)
    );
  }

  setContainer() {
    const vh = document.documentElement.clientHeight;
    const container = document.querySelector('.center-container') as HTMLElement;

    container.style.minHeight = (vh - 60) + 'px';
  }

  prev() {
    if (this.index > 0) this.index--;
  }

  select(index) {
    this.index = index;
  }

  next() {
    if (this.index < this.page.length - 1) this.index++;
  }
  
}
