import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.sass']
})
export class ProductListComponent implements OnInit {

  type;
  name;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const path = this.route.snapshot.paramMap.get('path').split('-');
    [ this.type, this.name ] = [ path[0], path.slice(1).join(' ') ];
    
  }

}
