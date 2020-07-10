import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CdkDrag,
  CdkDragStart,
  CdkDropList, CdkDropListGroup, CdkDragMove, CdkDragEnter,
  moveItemInArray
} from "@angular/cdk/drag-drop";

import { ViewportRuler } from "@angular/cdk/overlay";

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.sass']
})
export class ProductComponent implements OnInit {

  //#region Slider

  counter = 0;
  size = 0;
  sizeFrame = 0;

  //#endregion Slider

  //#region Star

  starCount = [];
  noneStarCount = [];
  starHalf = false;

  //#endregion Star

  //#region Authentication
  
  userDetails;

  id = '';

  //#endregion Authentication

  //#region Models

  product = {
    _id: '',
    imgPath: '',
    name: '',
    status: '',
    price: 0,
    quantity: { imported: 0, exported: 0 },
    star: { number: 0, countRate: 0 },
    type: '',
    colors: [],
    properties: [],
    technicalDetails: [],
    description: '',
    post: {
      content: '',
      dateModified: ''
    },
    slidersPaths: []
  };

  preview = {
    color: {
      name: '',
      value: '',
    },
    properties: []
  }

  order = {
    name: '',
    price: 0,
    color: {
      name: '',
      value: '',
    },
    properties: []
  }

  post = {
    content: '',
    dateModified: Date.now()
  }

  //#endregion Models

  //#region Formater

  priceFormated;

  //#endregion Formater

  //#region Image Cropper

  img: any = '';
  imgs = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';

  //#endregion Image Cropper

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

  //#region Post Editor

  public imageSettings = {
    saveUrl : 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save'
  };

  public tools: object = {
    type: 'MultiRow',
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
    'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
    'LowerCase', 'UpperCase', '|',
    'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
    'Outdent', 'Indent', '|',
    'CreateLink', 'RemoveLink', 'Image', 'CreateTable', '|', 'ClearFormat', 'Print',
    'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
  };

  //#endregion Post Editor

  @HostListener('window:resize')
  onResize() {
    const leftContainer = document.querySelector('.left-container') as HTMLElement;
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const closeBtn = document.getElementById('close-btn');

    carouselSlide.style.transition = 'none';

    this.showSlider();
    if (leftContainer.style.getPropertyValue('position') == 'fixed') this.showGallery();
    else if (closeBtn.style.getPropertyValue('display') == 'none') this.closeGallery();
  }

  constructor(private viewportRuler: ViewportRuler,
              private route: ActivatedRoute,
              private authService: AuthService,
              public productService: ProductService,
              private router: Router) {
    this.target = null;
    this.source = null;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    this.productService.getProduct(this.id).subscribe(
      res => {
        this.product = res['product'];

        this.order.name = this.product.name;
        this.order.price = this.product.price;

        this.preview.color = this.order.color = JSON.parse(JSON.stringify(this.product.colors[0]));

        this.product.properties.forEach(p => {
          let property = {
            name: p.name,
            option: {
              value: p.options[0].value,
              price: p.options[0].price
            }
          };

          this.preview.properties.push(JSON.parse(JSON.stringify(property)));
          this.order.properties.push(JSON.parse(JSON.stringify(property)));
        });

        this.priceFormated = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(this.product.price);

        for (const slider of this.product.slidersPaths) if (slider[0] == this.order.color.value) this.imgs = slider.slice(1);

        this.initPost();

        this.showStar();
        this.showSlider();

        if (this.authService.getToken()){
          this.authService.getInfo().subscribe(
            res => {
              this.userDetails = res['user'];
            }, err => {
              if (!err.error.auth) this.authService.removeToken();
            }
          );
        }
      },
      err => {
        alert(err.error.msg);
        this.router.navigateByUrl('');
      }
    );
  }

  //#region Star

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

  //#endregion Star

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
    const body = document.querySelector('body');
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

    body.style.overflowY = 'hidden';

    leftContainer.style.position = 'fixed';
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
    const body = document.querySelector('body');
    const leftContainer = document.querySelector('.left-container') as HTMLElement;
    const carouselContainer = document.querySelector('.carousel-container') as HTMLElement;
    const carouselImages = document.querySelectorAll('.carousel-slide img') as NodeListOf<HTMLElement>;
    const galleryCarouselNav = document.querySelector('.gallery-carousel-nav') as HTMLElement;
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const vpWidth = document.documentElement.clientWidth;
    const closeBtn = document.getElementById('close-btn');

    body.style.overflowY = 'visible';

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

    carouselContainer.style.height = carouselSlide.clientHeight + 'px';
  }

  //#endregion Slider

  //#region Order

  reloadSlider() {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;

    this.imgs = [];

    for (const slider of this.product.slidersPaths) if (slider[0] == this.preview.color.value) this.imgs = slider.slice(1);

    carouselSlide.style.transition = 'none';
    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
  }

  onCheckColor(color) {
    this.preview.color = this.order.color = JSON.parse(JSON.stringify(color));

    this.reloadSlider();
  }

  previewColor(color) {
    this.preview.color = JSON.parse(JSON.stringify(color));

    this.reloadSlider();
  }

  resetColor() {
    this.preview.color = this.order.color;
    
    this.reloadSlider();
  }

  updatePrice() {
    this.order.price = this.order.properties.map(p => p.option.price).reduce((a, b) => a + b, this.product.price);
    this.priceFormated = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(this.order.price);
  }

  onCheckOption(i, option) {
    this.preview.properties[i].option = this.order.properties[i].option = JSON.parse(JSON.stringify(option));

    this.updatePrice();
  }

  previewOption(i, option) {
    this.preview.properties[i].option.value = JSON.parse(JSON.stringify(option)).value;
  }

  resetOption() {
    this.preview.properties = JSON.parse(JSON.stringify(this.order.properties));
  }

  //#endregion Order

  //#region Slider Editor

  isSaveImgs() {
    for (let i = 0; i < this.product.slidersPaths.length; i++) {
      if (this.product.slidersPaths[i][0] == this.preview.color.value) {
        if (this.imgs.length == this.product.slidersPaths[i].slice(1).length) {
          let count = 0;
          for (let j = 0; j < this.product.slidersPaths[i].slice(1).length; j++) if (this.imgs[j] == this.product.slidersPaths[i].slice(1)[j]) count++;
          if (count == this.imgs.length) return false;
        } else return true;
      }
    }
    if (!this.imgs.length) return false;
    return true;
  }

  saveSlider() {
    this.authService.getInfo().subscribe(res => {
      if (res['user'].role == 'root' || res['user'].role === 'admin') {
        if (this.isSaveImgs()) {
          const formData = new FormData();

          formData.append('imgs', this.order.color.value);
          for(let img of this.imgs) formData.append('imgs', img);
  
          this.productService.uploadImgs(this.id, formData).subscribe(
            res => {
              alert(res['msg']);
              this.productService.getProduct(this.id).subscribe(
                res => {
                  this.product = res['product'];
                },
                err => {
                  alert(err.error.msg);
                  this.router.navigateByUrl('');
                }
              );
            },
            err => {
              alert(err.error.msg);
            }
          );
        }
      } else this.router.navigateByUrl('');
    });
  }

  cancelSaveSlider() {
    this.authService.getInfo().subscribe(res => {
      if (res['user'].role == 'root' || res['user'].role === 'admin') this.onCheckColor(this.order.color);
      else this.router.navigateByUrl('');
    });
  }

  //#endregion Slider Editor

  //#region Image Cropper

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  add() {
    this.imgs.push(this.croppedImage);
    this.cancel();
  }

  delete(i) {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    if (confirm('Are you sure delete: Image ' + (i + 1) + '?')) {
      this.imgs.splice(i, 1);
      
      this.counter = 0;
      carouselSlide.style.transition = 'none';
      carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    }
  }

  cancel() {
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  //#endregion Image Cropper

  //#region Drag and drop

  dragMoved(e: CdkDragMove) {
    let point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach(dropList => {
      if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }

  dropListDropped() {
    if (!this.target)
      return;

    let phElement = this.placeholder.element.nativeElement;
    let parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

    this.target = null;
    this.source = null;

    if (this.sourceIndex != this.targetIndex)
      moveItemInArray(this.imgs, this.sourceIndex, this.targetIndex);
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop == this.placeholder)
      return true;

    if (drop != this.activeContainer)
      return false;

    let phElement = this.placeholder.element.nativeElement;
    let sourceElement = drag.dropContainer.element.nativeElement;
    let dropElement = drop.element.nativeElement;

    let dragIndex = __indexOf(dropElement.parentElement.children, (this.source ? phElement : sourceElement));
    let dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = '100%';
      phElement.style.height = '100%';
      
      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex 
      ? dropElement.nextSibling : dropElement));

    this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
    return false;
  }
  
  /** Determines the point of the page that was touched by the user. */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
    const point = __isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    const scrollPosition = this.viewportRuler.getViewportScrollPosition();

    return {
        x: point.pageX - scrollPosition.left,
        y: point.pageY - scrollPosition.top
    };
  }

  //#endregion Drag and drop

  //#region Post Editor

  initPost() {
    this.post.content = this.product.post ? this.product.post.content : '<p style=\"text-align: center;\"><strong><span style=\"font-size: 36pt; color: red;\">' + this.product.name + '</span></strong></p><p style=\"text-align: center;\"><span style=\"font-size: 18pt;\">Content</span></p><p style=\"text-align: center;\"><span style=\"font-size: 18pt;\"></span></p>';
  }

  isSavePost() {
    return this.product.post ? this.post.content != this.product.post.content : true;
  }

  savePost() {
    this.authService.getInfo().subscribe(res => {
      if (res['user'].role == 'root' || res['user'].role === 'admin') {
        this.post.dateModified = Date.now();
        this.productService.post(this.id, this.post).subscribe(
          res => {
            alert(res['msg']);
          },
          err => {
            alert(err.error.msg);
          }
        );
      } else this.router.navigateByUrl('');
    });
  }

  cancelSavePost() {
    this.authService.getInfo().subscribe(res => {
      if (res['user'].role == 'root' || res['user'].role === 'admin') this.initPost();
      else this.router.navigateByUrl('');
    });
  }

  //#endregion Post Editor

}

//#region Helpers

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
};

/** Determines whether an event is a touch event. */
function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type.startsWith('touch');
}

function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
  const {top, bottom, left, right} = dropList.element.nativeElement.getBoundingClientRect();
  return y >= top && y <= bottom && x >= left && x <= right; 
}

//#endregion Helpers