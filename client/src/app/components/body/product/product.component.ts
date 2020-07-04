import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CdkDrag,
  CdkDragStart,
  CdkDropList, CdkDropListGroup, CdkDragMove, CdkDragEnter,
  moveItemInArray
} from "@angular/cdk/drag-drop";

import {ViewportRuler} from "@angular/cdk/overlay";

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass']
})
export class ProductComponent implements OnInit {
  counter = 0;
  size = 0;
  sizeFrame = 0;

  starCount = [];
  noneStarCount = [];
  starHalf = false

  product = {
    _id: '',
    name: '',
    status: '',
    price: 0,
    quantity: { imported: 0, exported: 0 },
    star: { number: 0, countRate: 0 },
    type: '',
    colors: [],
    styles: [],
    editions: [],
    capacitys: [],
    technicalDetails: [],
    description: '',
    post: '',
  };

  order = {
    color: {
      preview: '',
      name: '',
      value: '',
    },
  }

  img: any = '';
  imgs = [ 'assets/img/carousel/A.png', 'assets/img/carousel/B.png', 'assets/img/carousel/C.png' ];
  imageChangedEvent: any = '';
  croppedImage: any = '';

  //#region Drap And Drop

  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;

  //#endregion Drap And Drop

  @HostListener('window:resize')
  onResize() {
    const leftContainer = document.querySelector('.left-container') as HTMLElement;
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const closeBtn = document.getElementById('close-btn');

    carouselSlide.style.transition = 'none';

    this.showSlider();
    if (leftContainer.style.getPropertyValue('position') == 'absolute') this.showGallery();
    else if (closeBtn.style.getPropertyValue('display') == 'none') this.closeGallery();
  }

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private router: Router) {
    this.target = null;
    this.source = null;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.productService.getProduct(id).subscribe(
      res => {
        this.product = res['product'];

        this.showStar();
        this.showSlider();

        this.order.color.name = this.order.color.preview = this.product.colors[0].name;
      },
      err => {
        alert(err.error.msg);
        this.router.navigateByUrl('');
      }
    );
  }

  showStar() {
    let number = this.product.star.number,
        numberRounded = Math.round(number),
        bias = Math.round((number - numberRounded) * 10) / 10;
    
    if (bias < 0) bias++;

    if (bias == 0.5) {
      for (let i = 0; i < numberRounded - 1; i++) this.starCount.push('*');
      this.starHalf = true;
    } else for (let i = 0; i < numberRounded; i++) this.starCount.push('*');
    for (let i = 0; i < 5 - numberRounded; i++) this.noneStarCount.push('-');
  }

  //#region Slider

  showSlider() {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const vpWidth = document.documentElement.clientWidth;
    const carouselContainerWidth = vpWidth * 0.395;
    const carouselContainerHeight = carouselContainerWidth * 0.75;
    const carouselButtonWidth = vpWidth * 0.05;
    const carouselButtonHeight = carouselButtonWidth * 1.04;

    prevBtn.style.top = nextBtn.style.top = ((carouselContainerHeight - carouselButtonHeight) * 0.5 + 140) + 'px';
    prevBtn.style.left = (vpWidth * 0.1 + carouselContainerWidth * 0.03) + 'px';
    nextBtn.style.left = (vpWidth * 0.1 + carouselContainerWidth - carouselButtonWidth - carouselContainerWidth * 0.03) + 'px';

    this.size = carouselSlide.offsetWidth;

    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    carouselSlide.style.cursor = 'zoom-in';
  }

  prev() {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const galleryFrame = document.querySelector('.gallery-frame') as HTMLElement;

    if (this.counter <= 0) return;

    carouselSlide.style.transition = 'transform 0.4s ease-in-out';
    galleryFrame.style.transition = 'transform 0.4s ease-in-out';
    this.counter--;
    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    galleryFrame.style.transform = 'translateX(' + ((this.sizeFrame + 1) * (this.counter + 1) + 1) + 'px)';
  }

  next() {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const carouselImages = document.querySelectorAll('.carousel-slide img') as NodeListOf<Element>;
    const galleryFrame = document.querySelector('.gallery-frame') as HTMLElement;

    if (this.counter >= carouselImages.length - 1) return;
    
    carouselSlide.style.transition = 'transform 0.4s ease-in-out';
    galleryFrame.style.transition = 'transform 0.4s ease-in-out';
    this.counter++;
    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    galleryFrame.style.transform = 'translateX(' + ((this.sizeFrame + 1) * (this.counter + 1) + 1) + 'px)';
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
    const galleryCarouselNav = document.querySelector('.gallery-carousel-nav') as HTMLElement;
    const galleryFrame = document.querySelector('.gallery-frame') as HTMLElement;
    const galleryCarouselImages = document.querySelectorAll('.gallery-carousel-nav img') as NodeListOf<HTMLElement>;
    const closeBtn = document.getElementById('close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const vpWidth = document.documentElement.clientWidth;
    const vpHeight = document.documentElement.clientHeight;
    const carouselButtonWidth = vpWidth * 0.05;
    const carouselButtonHeight = vpWidth * 0.05 * 1.04;

    leftContainer.style.position = 'absolute';
    leftContainer.style.zIndex = '103';
    leftContainer.style.top = '0';
    leftContainer.style.margin = '0 10%';
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

    closeBtn.style.display = 'inline';
    closeBtn.style.padding = '5px 5px 2px 5px';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.background = 'red';
    closeBtn.style.cursor = 'zoom-out';
    prevBtn.style.top = nextBtn.style.top = (carouselContainer.clientHeight - carouselButtonHeight) * 0.5 + 'px';
    prevBtn.style.left = ((vpWidth - carouselContainer.clientWidth) * 0.5 + carouselContainer.clientWidth * 0.03) + 'px';
    nextBtn.style.left = ((vpWidth - carouselContainer.clientWidth) * 0.5 + carouselContainer.clientWidth * (1 - 0.03) - carouselButtonWidth) + 'px';

    carouselSlide.style.transition = 'none';
    carouselSlide.style.transform = 'translateX(' + (-this.size * 0) + 'px)';

    this.size = carouselImages[0].offsetWidth;

    carouselContainer.style.width = this.size + 'px';
    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    carouselSlide.style.cursor = 'auto';

    galleryCarouselNav.style.position = 'absolute';
    galleryCarouselNav.style.display = 'flex';
    galleryCarouselNav.style.bottom = '0';

    for (let i = 0; i < galleryCarouselImages.length; i++) {
      galleryCarouselImages[i].style.height = (vpHeight - carouselContainer.clientHeight - 10) + 'px';
      if (i > 0 && i < galleryCarouselImages.length - 1) galleryCarouselImages[i].style.marginRight = '1px';
    }

    if (galleryCarouselImages.length * galleryCarouselImages[0].clientWidth >= vpWidth) {
      galleryCarouselNav.style.width = (vpWidth + galleryCarouselImages[0].clientWidth) + 'px';
      galleryCarouselNav.style.overflow = 'auto';
    } else galleryCarouselNav.style.width = galleryCarouselImages.length * galleryCarouselImages[0].clientWidth + 'px';

    this.sizeFrame = galleryCarouselImages[this.counter].clientWidth;
    
    if (galleryCarouselImages.length * galleryCarouselImages[0].clientWidth < vpWidth) galleryCarouselNav.style.transform = 'translateX(' + (-this.sizeFrame * 0.5 - (galleryCarouselImages.length - 1)) + 'px)';
    else galleryCarouselNav.style.transform = 'translateX(' + (-this.sizeFrame * 0.5) + 'px)';

    galleryFrame.style.transition = 'none';
    galleryFrame.style.transform = 'translateX(' + ((this.sizeFrame + 1) * (this.counter + 1) + 1) + 'px)';
  }

  selectImg(event: any) {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const galleryCarouselNav = document.querySelector('.gallery-carousel-nav') as HTMLElement;
    const galleryFrame = document.querySelector('.gallery-frame') as HTMLElement;
    const imgs = Array.from(galleryCarouselNav.children);
    const targetImg = event.target.closest('img');

    if (!targetImg) return;

    const targetIndex = imgs.findIndex(img => img == targetImg);

    if (targetIndex < 0) return;

    carouselSlide.style.transition = 'transform 0.4s ease-in-out';
    galleryFrame.style.transition = 'transform 0.4s ease-in-out';

    this.counter = targetIndex - 1;

    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    galleryFrame.style.transform = 'translateX(' + ((this.sizeFrame + 1) * (this.counter + 1) + 1) + 'px)';
  }

  closeGallery() {
    const leftContainer = document.querySelector('.left-container') as HTMLElement;
    const carouselContainer = document.querySelector('.carousel-container') as HTMLElement;
    const carouselImages = document.querySelectorAll('.carousel-slide img') as NodeListOf<HTMLElement>;
    const galleryCarouselNav = document.querySelector('.gallery-carousel-nav') as HTMLElement;
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const vpWidth = document.documentElement.clientWidth;
    const closeBtn = document.getElementById('close-btn');

    leftContainer.style.position = 'static';
    leftContainer.style.zIndex = '0';
    leftContainer.style.width = vpWidth * 0.395 + 'px';
    leftContainer.style.margin = '10px 0.5% 0 10%';
    leftContainer.style.height = leftContainer.clientWidth * 0.75 + 'px';
    leftContainer.style.marginLeft = '10%';

    closeBtn.style.display = 'none';

    carouselSlide.style.transition = 'none';

    galleryCarouselNav.style.display = 'none';

    this.showSlider();

    for (let i = 0; i < carouselImages.length; i++) {
      carouselImages[i].style.width = '100%';
      carouselImages[i].style.height = '100%';
    }

    carouselContainer.style.width = carouselImages[0].clientWidth + 'px';
    carouselContainer.style.height = carouselImages[0].clientHeight + 'px';
  }

  //#endregion Slider

  //#region Order

  onCheck(color) {
    this.order.color.preview = color.name;
    this.order.color.value = color.value;
  }

  preview(color) {
    this.order.color.preview = color.name;
  }

  reset() {
    this.order.color.preview = this.order.color.name;
  }

  //#endregion Order

  //#region Image Cropper

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  add() {
    this.imgs.push(this.croppedImage);
    // this.imageChangedEvent = '';
    // this.croppedImage = '';
  }

  delete(i) {

  }

  edit(img) {

  }

  //#endregion Image Cropper

  //#region Drag and drop

  ngAfterViewInit() {
    let phElement = this.placeholder.element.nativeElement;

    phElement.style.display = 'none';
    phElement.parentElement.removeChild(phElement);
  }

  dragMoved(e: CdkDragMove) {
    let point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach(dropList => {
      if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }

  //#endregion Drag and drop

}
