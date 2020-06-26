import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass']
})
export class ProductComponent implements OnInit {
  counter = 0;
  size = 0;
  
  constructor() { }

  ngOnInit(): void {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const vpWidth = document.documentElement.clientWidth;
    const carouselContainerWidth = vpWidth * (0.4 - 0.005) * (1 - 0.2);
    const carouselContainerHeight = carouselContainerWidth * 0.75;
    const carouselButtonHeight = vpWidth * 0.05 * 1.04;

    prevBtn.style.top = ((carouselContainerHeight + vpWidth * 0.005 - carouselButtonHeight) * 0.5 + 60) + 'px';
    prevBtn.style.left = (vpWidth * (0.1 + 0.4 * 0.1 - 0.005) + carouselContainerWidth * 0.05) + 'px';

    nextBtn.style.top = ((carouselContainerHeight + vpWidth * 0.005 - carouselButtonHeight) * 0.5 + 60) + 'px';
    nextBtn.style.left = (vpWidth * (0.1 + 0.4 * 0.8) - carouselContainerWidth * 0.05) + 'px';

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

  showArrow() {
    const carouselImages = document.querySelectorAll('.carousel-slide img') as NodeListOf<Element>;
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (this.counter > 0) prevBtn.style.display = 'inline';
    if (this.counter < carouselImages.length - 1) nextBtn.style.display = 'inline';
  }

  hideArrow() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }

  moved() {
    const carouselImages = document.querySelectorAll('.carousel-slide img') as NodeListOf<Element>;
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (this.counter > 0) this.showArrow();

    if (this.counter == 0) prevBtn.style.display = 'none';
    if (this.counter == carouselImages.length - 1) nextBtn.style.display = 'none';
  }

  showGallery() {
    const leftContainer = document.querySelector('.left-container') as HTMLElement;
    const carouselContainer = document.querySelector('.carousel-container') as HTMLElement;
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const carouselImages = document.querySelectorAll('.carousel-slide img') as NodeListOf<HTMLElement>;
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const vpWidth = document.documentElement.clientWidth;
    const carouselButtonWidth = vpWidth * 0.05;
    const carouselButtonHeight = vpWidth * 0.05 * 1.04;

    leftContainer.style.position = 'absolute';
    leftContainer.style.zIndex = '103';
    leftContainer.style.top = '0';
    leftContainer.style.padding = '0';
    leftContainer.style.background = 'black';
    leftContainer.style.left = '-10%';
    leftContainer.style.width = '100vw';
    leftContainer.style.height = '100vh';

    prevBtn.style.fill = 'white';
    prevBtn.style.top = '45%';
    prevBtn.style.left = ((vpWidth - carouselImages[0].offsetWidth) * 0.5 + carouselImages[0].offsetWidth * 0.03) + 'px';

    nextBtn.style.fill = 'white';
    nextBtn.style.top = '45%';
    nextBtn.style.left = ((vpWidth - carouselImages[0].offsetWidth) * 0.5 + carouselImages[0].offsetWidth * (1 - 0.03) - carouselButtonWidth) + 'px';

    carouselSlide.style.transition = 'none';
    carouselSlide.style.transform = 'translateX(' + (-this.size * 0) + 'px)';

    this.size = carouselImages[0].offsetWidth;

    carouselContainer.style.width = this.size + 'px';
    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
  }
}
