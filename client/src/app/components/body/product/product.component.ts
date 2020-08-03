import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDrag, CdkDropList, CdkDropListGroup, CdkDragMove, moveItemInArray } from "@angular/cdk/drag-drop";

import { ViewportRuler } from "@angular/cdk/overlay";

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { environment } from 'src/environments/environment';

import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

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

  //#region Review Slider

  reviewCounter = 0;
  reviewSize = 0;
  reviewSizeFrame = 0;

  //#endregion Review Slider

  //#region Star

  starCount = [];
  noneStarCount = [];
  starHalf = false;

  //#endregion Star

  //#region Authentication
  
  userDetails;

  id = '';
  type = '';

  //#endregion Authentication

  //#region Models

  product = {
    _id: '',
    img: { index: -1, path: ''},
    name: '',
    status: '',
    price: 0,
    quantity: { imported: 0, exported: 0 },
    reviews: [],
    type: '',
    colors: [],
    properties: [],
    technicalDetails: [],
    description: '',
    post: {
      content: '',
      dateModified: ''
    },
    sliders: []
  };

  preview = {
    color: {
      name: '',
      value: '',
    },
    properties: [],
    star: 0
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

  review = {
    index: 0,
    user: {
      username: '',
    },
    star: 0,
    content: '',
    img: [],
    imgs: [],
    files: []
  }

  stars = {
    total: 0,
    star: [],
    average: 0,
  }

  reviewGallery = {
    stars: {
      count: [],
      none: []
    },
    content: '',
    imgs: []
  }

  //#endregion Models

  //#region Formater

  priceFormated;

  //#endregion Formater

  //#region Image Cropper

  path: any = '';
  paths = [];
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
  
  //#region Reviews

  reviews;
  reviewEvent;
  isShowReviewGallery = false;

  //#endregion Reviews
  
  //#region Resize

  resize = false;

  //#endregion Resize

  @HostListener('window:resize')
  onResize() {
    const leftContainer = document.querySelector('.left-container') as HTMLElement;
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const closeBtn = document.getElementById('close-btn');

    carouselSlide.style.transition = 'none';

    this.resize = true;

    this.showSlider();
    if (leftContainer.style.getPropertyValue('position') == 'fixed') this.showGallery();
    else if (closeBtn.style.getPropertyValue('display') == 'none') this.closeGallery();

    if (this.isShowReviewGallery) this.showReviewGallery(this.reviewEvent, this.reviewGallery);
  }

  constructor(private viewportRuler: ViewportRuler,
              private route: ActivatedRoute,
              private titleService: Title,
              public helperService: HelperService,
              private authService: AuthService,
              private productService: ProductService,
              private userService: UserService,
              private router: Router) {
    this.target = null;
    this.source = null;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.paramMap.get('type');

    this.productService.getProduct(this.id).subscribe(
      res => {
        this.product = res['product'];

        this.titleService.setTitle(this.product.name + ' | Lmaci');

        this.order.name = this.product.name;
        this.order.price = this.product.price;

        if (this.product.colors[0]) this.preview.color = this.order.color = JSON.parse(JSON.stringify(this.product.colors[0]));

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

        this.priceFormated = this.helperService.USDcurrency(this.product.price);

        this.reviews = this.product.reviews;

        this.setPaths();

        this.initPost();
        this.initStars();
        this.initReviews();

        this.loadPost();
        this.showStar();
        this.showSlider();

        if (this.authService.getToken()){
          this.authService.getInfo().subscribe(
            res => this.userDetails = res['user'],
            err => {
              if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login');
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

  initStars() {
    this.stars.total = this.product.reviews.length;

    this.stars.star = [];
    for (let i = 5; i > 0; i--) {
      const star = {
        index: i,
        count: 0
      }
      star.count = this.product.reviews.filter(r => r.star == i).length;
      this.stars.star.push(star);
    }
    
    this.stars.average = this.helperService.round(this.helperService.average(this.product.reviews.map(r => parseInt(r.star))), 1);
  }

  showStar() {
    const number = this.stars.average;
    const numberFloored = Math.floor(number);
    const numberRounded = Math.round(number);
    const bias = this.helperService.round(number - numberFloored, 1)

    this.starCount = [];
    this.starHalf = false;
    this.noneStarCount = [];

    if (bias == 0.5) {
      for (let i = 0; i < numberFloored; i++) this.starCount.push('*');
      this.starHalf = true;
    } else for (let i = 0; i < numberRounded; i++) this.starCount.push('*');
    for (let i = 0; i < 5 - numberRounded; i++) this.noneStarCount.push('-');
  }

  //#endregion Star

  //#region Slider

  setPaths() {
    if (this.product.sliders.length && this.product.sliders.filter(s => s.color == this.order.color.value).length && this.product.sliders.filter(s => s.color == this.order.color.value)[0].imgs.length) this.paths = this.product.sliders.filter(s => s.color == this.order.color.value)[0].imgs.map(img => img.path);
  }

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

    carouselSlide.style.transition = galleryFrame.style.transition = 'transform 0.4s ease-in-out';
    this.counter--;
    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    galleryFrame.style.transform = 'translateX(' + ((this.sizeFrame + 1) * this.counter + 1) + 'px)';

    this.scrollFrame();
  }

  next() {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    const carouselImages = document.querySelectorAll('.carousel-slide img') as NodeListOf<Element>;
    const galleryFrame = document.querySelector('.gallery-frame') as HTMLElement;

    if (this.counter >= carouselImages.length - 1) return;
    
    carouselSlide.style.transition = galleryFrame.style.transition = 'transform 0.4s ease-in-out';
    this.counter++;
    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    galleryFrame.style.transform = 'translateX(' + ((this.sizeFrame + 1) * this.counter + 1) + 'px)';

    this.scrollFrame();
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

    prevBtn.style.display = nextBtn.style.display = 'none';
  }

  moved() {
    const carouselImages = document.querySelectorAll('.carousel-slide img') as NodeListOf<Element>;
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    this.showArrow();

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
    leftContainer.style.top = leftContainer.style.padding = '0';
    leftContainer.style.margin = '0 10%';
    leftContainer.style.background = 'black';
    leftContainer.style.left = '-10%';
    leftContainer.style.width = '100vw';
    leftContainer.style.height = '100vh';

    this.size = Math.round(vpHeight * 1.2);

    for (let i = 0; i < carouselImages.length; i++) {
      carouselImages[i].style.height = this.size * 3/4 + 'px';
      carouselImages[i].style.width = this.size + 'px';
    }

    carouselContainer.style.height = carouselImages[0].clientHeight + 'px';
    carouselContainer.style.width = carouselImages[0].clientWidth + 'px';

    closeBtn.style.display = 'inline';
    closeBtn.style.padding = '5px 5px 2px 5px';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.top = closeBtn.style.right = '10px';
    closeBtn.style.background = 'red';
    closeBtn.style.cursor = 'zoom-out';
    prevBtn.style.top = nextBtn.style.top = (carouselContainer.clientHeight - carouselButtonHeight) * 0.5 + 'px';
    prevBtn.style.left = ((vpWidth - carouselContainer.clientWidth) * 0.5 + carouselContainer.clientWidth * 0.03) + 'px';
    nextBtn.style.left = ((vpWidth - carouselContainer.clientWidth) * 0.5 + carouselContainer.clientWidth * (1 - 0.03) - carouselButtonWidth) + 'px';

    carouselSlide.style.transition = 'none';
    carouselSlide.style.transform = 'translateX(' + (-this.size * 0) + 'px)';

    carouselContainer.style.width = this.size + 'px';
    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    carouselSlide.style.cursor = 'auto';

    galleryCarouselNav.style.position = 'absolute';
    galleryCarouselNav.style.display = 'flex';
    galleryCarouselNav.style.bottom = '0';

    this.sizeFrame = Math.round((vpHeight - carouselContainer.clientHeight - 10) * 4/3);

    for (let i = 0; i < galleryCarouselImages.length; i++) {
      galleryCarouselImages[i].style.width = this.sizeFrame + 'px';
      if (i > 0 && i < galleryCarouselImages.length - 1) galleryCarouselImages[i].style.marginRight = '1px';
    }

    if (galleryCarouselImages.length * galleryCarouselImages[0].clientWidth > vpWidth) {
      galleryCarouselNav.style.width = vpWidth + 'px';
      galleryCarouselNav.style.left = '0';
      galleryCarouselNav.style.overflowX = 'auto';
      galleryCarouselNav.style.overflowY = 'hidden';
    } else galleryCarouselNav.style.width = (galleryCarouselImages.length - 1) * (galleryCarouselImages[0].clientWidth + 1) + 'px';

    for (let i = 0; i < galleryCarouselImages.length; i++) {
      galleryCarouselImages[i].style.bottom = '0';
      galleryCarouselImages[i].style.transition = 'none';
      if (i > 0) galleryCarouselImages[i].style.transform = 'translate(' + (-(this.sizeFrame + 1)) + 'px, 2px)';
    }

    galleryFrame.style.transition = 'none';
    galleryFrame.style.zIndex = '1';
    galleryFrame.style.transform = 'translateX(' + (this.counter == 0 ? 1 : (this.sizeFrame + 1) * this.counter + 1) + 'px)';

    this.scrollFrame();
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

    carouselSlide.style.transition = galleryFrame.style.transition = 'transform 0.4s ease-in-out';

    this.counter = targetIndex - 1;

    carouselSlide.style.transform = 'translateX(' + (-this.size * this.counter) + 'px)';
    galleryFrame.style.transform = 'translateX(' + ((this.sizeFrame + 1) * this.counter + 1) + 'px)';
    
    this.scrollFrame();
  }

  scrollFrame() {
    const carouselImages = document.querySelectorAll('.carousel-slide img') as NodeListOf<Element>;
    const galleryCarouselNav = document.querySelector('.gallery-carousel-nav') as HTMLElement;
    const vpWidth = document.documentElement.clientWidth;

    const framCount = carouselImages.length;
    const visibleFramCount = Math.round(vpWidth / (this.sizeFrame + 1));

    galleryCarouselNav.scrollBy(-(this.sizeFrame + 1) * (framCount - visibleFramCount), 0);
    galleryCarouselNav.scrollBy((this.sizeFrame + 1) * (this.counter - Math.round(visibleFramCount / 2) + 1), 0);
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

    closeBtn.style.display = carouselSlide.style.transition = galleryCarouselNav.style.display = 'none';

    this.showSlider();

    for (let i = 0; i < carouselImages.length; i++) carouselImages[i].style.width = carouselImages[i].style.height = '100%';

    carouselContainer.style.height = carouselSlide.clientHeight + 'px';
  }

  //#endregion Slider

  //#region Order

  reloadSlider() {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;

    this.paths = [];

    if (this.product.sliders.length && this.product.sliders.filter(s => s.color == this.preview.color.value).length && this.product.sliders.filter(s => s.color == this.preview.color.value)[0].imgs) this.product.sliders.filter(s => s.color == this.preview.color.value)[0].imgs.forEach(i => this.paths.push(i.path));

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
    this.order.price = this.helperService.sum(this.order.properties.map(p => p.option.price), this.product.price);
    this.priceFormated = this.helperService.USDcurrency(this.order.price);
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
    return this.product.sliders.length && this.product.sliders.filter(s => s.color == this.preview.color.value).length && this.product.sliders.filter(s => s.color == this.preview.color.value)[0].imgs ? JSON.stringify(this.product.sliders.filter(s => s.color == this.preview.color.value)[0].imgs.map(i => i.path)) != JSON.stringify(this.paths) : this.paths.length;
  }

  saveSlider() {
    this.authService.getInfo().subscribe(
      res => {
        if (res['user'].role == 'root' || res['user'].role === 'admin') {
          if (this.isSaveImgs()) {
            const formData = new FormData();

            let index = this.product.sliders.length && this.product.sliders.filter(s => s.color == this.order.color.value).length && this.product.sliders.filter(s => s.color == this.order.color.value)[0].imgs.length ? Math.max(...this.product.sliders.filter(s => s.color == this.order.color.value)[0].imgs.map(i => i.index)) + 1 : 0;
            const indexs = [], paths = [];

            formData.append('color', this.order.color.value);

            this.paths.forEach(p => {
              if (this.helperService.isBase64(p, 'jpeg')) {
                const file = new File([ this.helperService.base64ToBlob(p, 'jpeg') ], 'img.jpeg', { type: 'image/jpeg' });
                formData.append('files', file, index + '.jpeg');
                
                indexs.push(index);
                p = environment.imageUrl + '/?image=product/' + this.id + '/slider/' + this.order.color.value.replace(/#/, '') + '/' + index++ + '.jpeg';
              }
              paths.push(p);
            });
            
            formData.append('indexs', JSON.stringify(indexs));
            formData.append('paths', JSON.stringify(paths));

            this.productService.uploadImgs(this.id, formData).subscribe(
              res => {
                alert(res['msg']);
                this.productService.getProduct(this.id).subscribe(
                  res => {
                    this.product = res['product'];

                    this.setPaths();
                  },
                  err => {
                    alert(err.error.msg);
                  }
                );
              },
              err => {
                alert(err.error.msg);
              }
            );
          }
        } else this.router.navigateByUrl('');
      },
      err => {
        if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login');
      }
    );
  }

  cancelSaveSlider() {
    this.authService.getInfo().subscribe(
      res => {
        if (res['user'].role == 'root' || res['user'].role === 'admin') this.onCheckColor(this.order.color);
      },
      err => {
        if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login');
      }
    );
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
    this.paths.push(this.croppedImage);
    this.cancel();
  }

  delete(i) {
    const carouselSlide = document.querySelector('.carousel-slide') as HTMLElement;
    if (confirm('Are you sure delete: Image ' + (i + 1) + '?')) {
      this.paths.splice(i, 1);
      
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

  ngAfterViewInit() {
    setTimeout(() => this.setChanged(), 500);
  }

  setChanged() {
    if (this.placeholder) {
      let phElement = this.placeholder.element.nativeElement;

      phElement.style.display = 'none';
      phElement.parentElement.removeChild(phElement);
    }
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
      moveItemInArray(this.paths, this.sourceIndex, this.targetIndex);
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

      phElement.style.width = phElement.style.height = '100%';
      
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
    this.post.content = this.product.post ? this.product.post.content : '<p style=\"text-align: center;\"><strong><span style=\"font-size: 36pt; color: red;\">' + this.product.name + '</span></strong></p><p style=\"text-align: center;\"><span style=\"font-size: 18pt;\">Content</span></p><p style=\"text-align: center;\"><span style=\"font-size: 18pt;\"><img src=\"' + this.product.img.path + '\" class=\"e-rte-image e-imginline e-resize\" alt=\"' + this.product.name + '\" width=\"auto\" height=\"auto\" style=\"min-width: 0px; min-height: 0px;\"> </span></p><p style=\"text-align: center;\"><span style=\"font-size: 18pt;\"></span></p>';
  }

  isSavePost() {
    return this.product.post ? this.post.content != this.product.post.content : true;
  }

  savePost() {
    this.authService.getInfo().subscribe(
      res => {
        if (res['user'].role == 'root' || res['user'].role === 'admin') {
          this.post.dateModified = Date.now();
          this.productService.post(this.id, this.post).subscribe(
            res => {
              alert(res['msg']);
              this.productService.getProduct(this.id).subscribe(
                res => {
                  this.product = res['product'];
          
                  this.initPost();
                  this.loadPost();
                },
                err => {
                  alert(err.error.msg);
                }
              );
            },
            err => {
              alert(err.error.msg);
            }
          );
        }
      },
      err => {
        if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login');
      }
    );
  }

  cancelSavePost() {
    this.authService.getInfo().subscribe(
      res => {
        if (res['user'].role == 'root' || res['user'].role === 'admin') this.initPost();
      },
      err => {
        if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login');
      }
    );
  }

  //#endregion Post Editor

  //#region Post

  loadPost() {
    const post_container = document.getElementById('post-container') as HTMLElement;

    if (this.product.post && this.product.post.content) post_container.innerHTML = this.product.post.content;
  }

  //#endregion Post

  //#region Review

  reloadStar(s) {
    const star = document.getElementsByClassName('star') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < star.length; i++) star[i].style.fill = i < s ? 'orange' : 'gray';
  }

  tickStar(s) {
    this.review.star = s;
    
    this.reloadStar(s);
  }

  previewStar(s) {
    const rating = [ 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent' ];
    const ratingMsg = document.getElementById('rating-msg') as HTMLElement;
    ratingMsg.innerHTML = rating[s - 1];
    ratingMsg.style.display = 'inline';

    this.reloadStar(s);
  }

  resetStar() {
    const rating = [ 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent' ];
    const ratingMsg = document.getElementById('rating-msg') as HTMLElement;
    if (this.review.star) ratingMsg.innerHTML = rating[this.review.star - 1];
    if (!this.review.star) ratingMsg.style.display = 'none';

    this.reloadStar(this.review.star);
  }

  enterReviewCamera() {
    const reviewCamera = document.getElementById('review-camera') as HTMLElement;

    reviewCamera.style.fill = 'white';
  }

  leaveReviewCamera() {
    const reviewCamera = document.getElementById('review-camera') as HTMLElement;

    reviewCamera.style.fill = 'black';
  }

  selectReviewFileInput(files) {
    if (files.length) {
      this.review.files.push(...files);

      for (const f of this.review.files) {
        let reader = new FileReader();

        reader.onload = (event:any) => this.review.imgs.push(event.target.result);

        reader.readAsDataURL(f);
      }
    }
  }

  sendReview() {
    if (this.authService.getToken()) {
      this.authService.getInfo().subscribe(
        res => {
          this.review.user.username = res['user'].username;

          if (res['user'].role == 'user') {
            this.productService.getProduct(this.id).subscribe(
              res => {
                this.product = res['product'];
                
                this.review.index = this.product.reviews.length ? Math.max(...this.product.reviews.map(r => r.index)) + 1 : 0;

                this.productService.sendReview(this.id, this.review, this.review.files).subscribe(
                  res => {
                    const ratingMsg = document.getElementById('rating-msg') as HTMLElement;

                    alert(res['msg']);

                    this.review = {
                      index: 0,
                      user: {
                        username: ''
                      },
                      star: 0,
                      content: '',
                      img: [],
                      imgs: [],
                      files: []
                    }

                    this.reloadStar(0);
                    ratingMsg.style.display = 'none';
                    this.ngOnInit();
                  },
                  err => alert(err.error.msg)
                );
              },
              err => alert(err.error.msg)
            );
          } else alert('Only users can review this product.');
        },
        err => {
          if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login');
        }
      );
    } else if (confirm('Do you want to login?')) window.open('login');
  }

  deleteReviewImg(i: string) {
    if (confirm('Are you sure delete: Image ' + (this.review.imgs.indexOf(i) + 1) + '?')) {
      this.review.files.splice(this.review.imgs.indexOf(i), 1);
      this.review.imgs.splice(this.review.imgs.indexOf(i), 1);
    };
  }

  //#endregion Review

  //#region Reviews

  initReviews() {
    this.product.reviews.forEach(r => {
      this.userService.getUser(r.user.username).subscribe(
        res => {
          r.user = res['user'];
          r.stars = {
            count: [],
            none: []
          }
          for (let i = 0; i < r.star; i++) r.stars.count.push('*');
          for (let i = 0; i < 5 - r.star; i++) r.stars.none.push('-');
        },
        err => {
          console.warn(err.error.msg);
        }
      );
    });
  }

  showReviewGallery(event: any, review: Object) {
    const reviewCarouselSlide = document.getElementsByClassName('review-carousel-slide') as HTMLCollectionOf<HTMLElement>;
    const reviewgallerycontainer = document.getElementById('review-allery-container') as HTMLElement;
    const reviewclosebtn = document.getElementById('review-close-btn') as HTMLElement;
    const reviewcarouselimg = document.getElementsByClassName('review-carousel-img') as HTMLCollectionOf<HTMLElement>;
    const reviewGalleryCarouselNav = document.querySelector('.review-gallery-carousel-nav') as HTMLElement;
    const imgsBar = event.target.closest('span.imgs-bar');
    const boxs = Array.from(imgsBar.children);
    const targetBox = event.target.closest('span');

    this.isShowReviewGallery = true;

    this.reviewEvent = event;
    this.reviewGallery.stars = Object(review).stars;
    this.reviewGallery.content = Object(review).content;
    this.reviewGallery.imgs = Object(review).imgs;

    reviewgallerycontainer.style.display = 'flex';

    reviewclosebtn.style.display = 'inline';

    if (!targetBox) return;
    const targetIndex = boxs.findIndex(box => box == targetBox);
    if (targetIndex < 0) return;

    if (!this.resize) this.reviewCounter = targetIndex;

    reviewGalleryCarouselNav.style.position = 'absolute';
    reviewGalleryCarouselNav.style.display = 'flex';
    reviewGalleryCarouselNav.style.bottom = '0';

    setTimeout(() => {
      const reviewGalleryCarouselImgs = document.querySelectorAll('.review-gallery-carousel-nav img') as NodeListOf<HTMLElement>;
      const reviewGalleryFrame = document.querySelector('.review-gallery-frame') as HTMLElement;

      for (let i = 0; i < reviewcarouselimg.length; i++) {
        if (reviewcarouselimg[i].clientHeight > reviewcarouselimg[i].clientWidth) reviewcarouselimg[i].style.height = '100%';
        else reviewcarouselimg[i].style.width = '100%';
        reviewcarouselimg[i].style.cursor = 'auto';
      }
      this.reviewSize = reviewCarouselSlide[0].offsetWidth;

      for (let i = 0; i < reviewCarouselSlide.length; i++) reviewCarouselSlide[i].style.transition = 'none';
      for (let i = 0; i < reviewCarouselSlide.length; i++) reviewCarouselSlide[i].style.transform = 'translateX(' + (-this.reviewSize * this.reviewCounter) + 'px)';
      
      this.reviewSizeFrame = Math.round(reviewGalleryCarouselNav.clientHeight * (reviewCarouselSlide[0].clientWidth / reviewCarouselSlide[0].clientHeight));

      for (let i = 0; i < reviewGalleryCarouselImgs.length; i++) {
        reviewGalleryCarouselImgs[i].style.width = this.reviewSizeFrame + 'px';
        if (i > 0 && i < reviewGalleryCarouselImgs.length - 1) reviewGalleryCarouselImgs[i].style.marginRight = '1px';
      }

      if (this.reviewSizeFrame * reviewGalleryCarouselImgs.length >= reviewCarouselSlide[0].offsetWidth) {
        reviewGalleryCarouselNav.style.width = reviewCarouselSlide[0].offsetWidth + 'px';
        reviewGalleryCarouselNav.style.left = reviewCarouselSlide[0].offsetWidth / 6 + 'px';
      } else {
        reviewGalleryCarouselNav.style.width = 'auto';
        reviewGalleryCarouselNav.style.left = (reviewCarouselSlide[0].offsetWidth / 6 + (reviewCarouselSlide[0].offsetWidth - (this.reviewSizeFrame + 1) * (reviewGalleryCarouselImgs.length - 1)) / 2 - reviewGalleryCarouselImgs.length) + 'px';
      }

      for (let i = 0; i < reviewGalleryCarouselImgs.length; i++) {
        reviewGalleryCarouselImgs[i].style.bottom = '0';
        reviewGalleryCarouselImgs[i].style.transition = 'none';
        if (i > 0) reviewGalleryCarouselImgs[i].style.transform = 'translate(' + (-(this.reviewSizeFrame + 1)) + 'px, 2px)';
      }

      reviewGalleryFrame.style.transition = 'none';
      reviewGalleryFrame.style.zIndex = '1';
      reviewGalleryFrame.style.transform = 'translateX(' + (this.reviewCounter == 0 ? 1 : (this.reviewSizeFrame + 1) * this.reviewCounter + 1) + 'px)';

      this.reviewScrollFrame();
    });

  }

  closeReviewGallery() {
    const reviewgallerycontainer = document.getElementById('review-allery-container') as HTMLElement;

    reviewgallerycontainer.style.display = 'none';
    this.resize = false;
    this.isShowReviewGallery = false;
  }

  reviewPrev() {
    const reviewCarouselSlide = document.getElementsByClassName('review-carousel-slide') as HTMLCollectionOf<HTMLElement>;
    const reviewGalleryFrame = document.querySelector('.review-gallery-frame') as HTMLElement;

    if (this.reviewCounter <= 0) return;

    for (let i = 0; i < reviewCarouselSlide.length; i++) reviewCarouselSlide[i].style.transition = 'transform 0.4s ease-in-out';
    reviewGalleryFrame.style.transition = 'transform 0.4s ease-in-out';
    this.reviewCounter--;
    for (let i = 0; i < reviewCarouselSlide.length; i++) reviewCarouselSlide[i].style.transform = 'translateX(' + (-this.reviewSize * this.reviewCounter) + 'px)';
    reviewGalleryFrame.style.transform = 'translateX(' + ((this.reviewSizeFrame + 1) * this.reviewCounter + 1) + 'px)';

    this.reviewScrollFrame();
  }

  reviewNext() {
    const reviewCarouselSlide = document.getElementsByClassName('review-carousel-slide') as HTMLCollectionOf<HTMLElement>;
    const reviewCarouselImg = document.getElementsByClassName('review-carousel-img') as HTMLCollectionOf<HTMLElement>;
    const reviewGalleryFrame = document.querySelector('.review-gallery-frame') as HTMLElement;

    if (this.reviewCounter >= reviewCarouselImg.length - 1) return;
    
    for (let i = 0; i < reviewCarouselSlide.length; i++) reviewCarouselSlide[i].style.transition = 'transform 0.4s ease-in-out';
    reviewGalleryFrame.style.transition = 'transform 0.4s ease-in-out';
    this.reviewCounter++;
    for (let i = 0; i < reviewCarouselSlide.length; i++) reviewCarouselSlide[i].style.transform = 'translateX(' + (-this.reviewSize * this.reviewCounter) + 'px)';
    reviewGalleryFrame.style.transform = 'translateX(' + ((this.reviewSizeFrame + 1) * this.reviewCounter + 1) + 'px)';

    this.reviewScrollFrame();
  }

  selectReviewImg(event: any) {
    const reviewCarouselSlide = document.getElementsByClassName('review-carousel-slide') as HTMLCollectionOf<HTMLElement>;
    const reviewGalleryCarouselNav = document.querySelector('.review-gallery-carousel-nav') as HTMLElement;
    const reviewGalleryFrame = document.querySelector('.review-gallery-frame') as HTMLElement;
    const imgs = Array.from(reviewGalleryCarouselNav.children);
    const targetImg = event.target.closest('img');

    if (!targetImg) return;

    const targetIndex = imgs.findIndex(img => img == targetImg);

    if (targetIndex < 0) return;

    for (let i = 0; i < reviewCarouselSlide.length; i++) reviewCarouselSlide[i].style.transition = 'transform 0.4s ease-in-out';
    reviewGalleryFrame.style.transition = 'transform 0.4s ease-in-out';

    this.reviewCounter = targetIndex - 1;

    for (let i = 0; i < reviewCarouselSlide.length; i++) reviewCarouselSlide[i].style.transform = 'translateX(' + (-this.reviewSize * this.reviewCounter) + 'px)';
    reviewGalleryFrame.style.transform = 'translateX(' + ((this.reviewSizeFrame + 1) * this.reviewCounter + 1) + 'px)';

    this.reviewScrollFrame();
  }

  reviewMoved() {
    const reviewCarouselImg = document.getElementsByClassName('review-carousel-img') as HTMLCollectionOf<HTMLElement>;
    const reviewPrevBtn = document.getElementById('review-prev-btn');
    const reviewNextBtn = document.getElementById('review-next-btn');

    this.resize = false;

    this.showReviewArrow();

    if (this.reviewCounter == 0) reviewPrevBtn.style.display = 'none';
    if (this.reviewCounter == reviewCarouselImg.length - 1) reviewNextBtn.style.display = 'none';
  }

  reviewScrollFrame() {
    const reviewCarouselSlide = document.getElementsByClassName('review-carousel-slide') as HTMLCollectionOf<HTMLElement>;
    const reviewCarouselImages = document.getElementsByClassName('review-carousel-img') as HTMLCollectionOf<HTMLElement>;
    const reviewGalleryCarouselNav = document.querySelector('.review-gallery-carousel-nav') as HTMLElement;

    const framCount = reviewCarouselImages.length;
    const visibleFramCount = Math.round(reviewCarouselSlide[0].offsetWidth / (this.reviewSizeFrame + 1));

    reviewGalleryCarouselNav.scrollBy(-(this.reviewSizeFrame + 1) * (framCount - visibleFramCount), 0);
    reviewGalleryCarouselNav.scrollBy((this.reviewSizeFrame + 1) * (this.reviewCounter - Math.round(visibleFramCount / 2) + 1), 0);
  }

  hideReviewArrow() {
    const reviewPrevBtn = document.getElementById('review-prev-btn') as HTMLElement;
    const reviewNextBtn = document.getElementById('review-next-btn') as HTMLElement;

    reviewPrevBtn.style.display = reviewNextBtn.style.display = 'none';
  }

  showReviewArrow() {
    const reviewCarouselImg = document.getElementsByClassName('review-carousel-img') as HTMLCollectionOf<HTMLElement>;
    const reviewPrevBtn = document.getElementById('review-prev-btn') as HTMLElement;
    const reviewNextBtn = document.getElementById('review-next-btn') as HTMLElement;

    if (this.reviewCounter > 0) reviewPrevBtn.style.display = 'inline';
    if (this.reviewCounter < reviewCarouselImg.length - 1) reviewNextBtn.style.display = 'inline';
  }

  //#endregion Reviews

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
