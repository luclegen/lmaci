import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass']
})
export class ProductComponent implements OnInit {
  counter = 0;
  size = 0;
  title = 'Test';

  @HostListener('window:resize')
  onResize() {
    const leftContainer = document.querySelector('.left-container') as HTMLElement;
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    carouselSlide.style.transition = 'none';
    this.ngOnInit();
    if (leftContainer.style.getPropertyValue('position') == 'absolute') {
      this.showGallery();
      this.showGallery();
    }
  }

  constructor() { }

  ngOnInit(): void {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const vpWidth = document.documentElement.clientWidth;
    const carouselContainerWidth = vpWidth * 0.395;
    const carouselContainerHeight = carouselContainerWidth * 0.75;
    const carouselButtonWidth = vpWidth * 0.05;
    const carouselButtonHeight = carouselButtonWidth * 1.04;

    prevBtn.style.top = nextBtn.style.top = ((carouselContainerHeight - carouselButtonHeight) * 0.5 + 130) + 'px';
    prevBtn.style.left = (vpWidth * 0.1 + carouselContainerWidth * 0.03) + 'px';
    nextBtn.style.left = (vpWidth * 0.1 + carouselContainerWidth - carouselButtonWidth - carouselContainerWidth * 0.03) + 'px';

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
    const galleryCarouselContainer = document.querySelector('.gallery-carousel-container') as HTMLElement;
    const galleryCarouselImages = document.querySelectorAll('.gallery-carousel-container img') as NodeListOf<HTMLElement>;
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const vpWidth = document.documentElement.clientWidth;
    const vpHeight = document.documentElement.clientHeight;
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

    for (let i = 0; i < carouselImages.length; i++) {
      carouselImages[i].style.height = vpHeight * 3/4 * 1.2 + 'px';
      carouselImages[i].style.width = carouselImages[i].clientHeight * 4/3 + 'px';
    }

    carouselContainer.style.height = carouselImages[0].clientHeight + 'px';
    carouselContainer.style.width = carouselImages[0].clientWidth + 'px';

    prevBtn.style.top = nextBtn.style.top = (carouselContainer.clientHeight - carouselButtonHeight) * 0.5 + 'px';
    prevBtn.style.left = ((vpWidth - carouselContainer.clientWidth) * 0.5 + carouselContainer.clientWidth * 0.03) + 'px';
    nextBtn.style.left = ((vpWidth - carouselContainer.clientWidth) * 0.5 + carouselContainer.clientWidth * (1 - 0.03) - carouselButtonWidth) + 'px';

    carouselSlide.style.transition = 'none';
    carouselSlide.style.transform = 'translateX(' + (-this.size * 0) + 'px)';

    this.size = carouselImages[0].offsetWidth;

    carouselContainer.style.width = this.size + 'px';
    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';

    galleryCarouselContainer.style.position = 'absolute';
    galleryCarouselContainer.style.display = 'flex';
    galleryCarouselContainer.style.bottom = '0';

    for (let i = 0; i < galleryCarouselImages.length; i++) {
      galleryCarouselImages[i].style.height = (vpHeight - carouselContainer.clientHeight - 2) + 'px';
      galleryCarouselImages[i].style.borderLeft = '2px solid black';
    }

    galleryCarouselContainer.style.width = galleryCarouselImages.length * galleryCarouselImages[0].clientWidth + 'px';
  }
}
