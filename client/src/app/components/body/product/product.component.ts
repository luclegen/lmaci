import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass']
})
export class ProductComponent implements OnInit {
  counter = 1;
  size = 0;
  
  constructor() { }

  ngOnInit(): void {
    const carouselContainer = document.querySelector('.carousel-container') as HTMLElement;
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;

    this.size = carouselSlide.offsetWidth;

    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';

  }

  prev() {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;

    if (this.counter <= 0) return;

    carouselSlide.style.transition = 'transform 0.4s ease-in-out';
    this.counter--;
    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
  }
 
  next() {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const carouselImages = document.querySelectorAll('.carousel-slide img') as NodeListOf<Element>;
    
    if (this.counter >= carouselImages.length - 1) return;
    
    carouselSlide.style.transition = 'transform 0.4s ease-in-out';
    this.counter++;
    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
  }

  moved() {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const carouselImages = document.querySelectorAll('.carousel-slide img') as NodeListOf<Element>;

    if (carouselImages[this.counter].id == 'lastClone') {
      carouselSlide.style.transition = 'none';
      this.counter = carouselImages.length - 2;
      carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    }
    if (carouselImages[this.counter].id == 'firstClone') {
      carouselSlide.style.transition = 'none';
      this.counter = carouselImages.length - this.counter;
      carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    }
  }
}
