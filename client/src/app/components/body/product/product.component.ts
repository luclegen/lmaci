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

  //#region Slideshow

  slideshow = {
    index: 0,
    size: 0,
    frameSize: 0,
    isOpenGallery: false
  }

  //#endregion Slideshow

  //#region Aside Slideshow

  asideSlideshow = {
    index: 0,
    size: 0,
    frameSize: 0,
    isOpenGallery: false,
    event: null
  }

  //#endregion Aside Slideshow

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
    comments: [],
    type: '',
    colors: [],
    properties: [],
    technicalDetails: [],
    description: '',
    post: {
      content: '',
      dateModified: ''
    },
    slideshows: []
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

  asideGallery = {
    stars: {
      count: [],
      none: []
    },
    content: '',
    imgs: []
  }

  comment = {
    index: 0,
    user: {
      username: '',
    },
    content: '',
    img: [],
    imgs: [],
    files: []
  }

  answer = {
    index: 0,
    user: {
      username: '',
    },
    content: '',
    img: [],
    imgs: [],
    files: []
  }

  //#endregion Models

  //#region Formater

  priceFormatted;

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
  indexStar;
  
  //#endregion Reviews

  //#region Comments

  comments;
  indexAnswer = -1;

  //#endregion Comments

  //#region Resize

  resize = false;
  asideEvent;
  isShowAsideGallery = false;

  //#endregion Resize

  @HostListener('window:resize')
  onResize() {
    if (this.slideshow.isOpenGallery) this.openGallery();
    if (!this.slideshow.isOpenGallery) this.closeGallery();
    // this.resize = true;

    // if (leftContainer.style.getPropertyValue('position') == 'fixed') this.showGallery();
    // else if (closeBtn.style.getPropertyValue('display') == 'none') this.closeGallery();

    // if (this.isShowAsideGallery) this.showAsideGallery(this.asideEvent, this.asideGallery);
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

        this.priceFormatted = this.helperService.USDcurrency(this.product.price);
        this.reviews = this.product.reviews;
        this.comments = this.product.comments;

        this.setPaths();
        this.setStar();
        this.setSlideshow();
        this.setCarousel();
        this.setPost();
        this.setReviews();
        this.setComments();

        if (this.authService.getToken()) this.authService.getInfo().subscribe(res => this.userDetails = res['user'], err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); });
      },
      err => {
        alert(err.error.msg);
        this.router.navigateByUrl('');
      }
    );
  }

  //#region Admin
  isAdmin() {
    return this.userDetails && (this.userDetails.role == 'root' || this.userDetails.role == 'admin');
  }
  //#endregion Admin

  //#region Star

  setStar() {
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
    
    const number = this.stars.average = this.helperService.round(this.helperService.average(this.product.reviews.map(r => parseInt(r.star))), 1);
    const numberFloored = Math.floor(number);
    const numberRounded = Math.round(number);
    const bias = this.helperService.round(number - numberFloored, 1)

    this.starCount = [];
    this.starHalf = bias == 0.5;
    this.noneStarCount = [];

    for (let i = 0; i < (bias == 0.5 ? numberFloored : numberRounded); i++) this.starCount.push('*');
    for (let i = 0; i < 5 - numberRounded; i++) this.noneStarCount.push('-');
  }

  //#endregion Star

  //#region Slideshow

  setPaths() {
    if (this.product.slideshows.length && this.product.slideshows.filter(s => s.color == this.order.color.value).length && this.product.slideshows.filter(s => s.color == this.order.color.value)[0].imgs.length) this.paths = this.product.slideshows.filter(s => s.color == this.order.color.value)[0].imgs.map(img => img.path);
  }

  setCarousel() {
    setTimeout(() => {
      const slides = document.querySelectorAll('.slideshow .slide') as NodeListOf<Element>;
      const container = document.querySelector('.slideshow .container') as HTMLElement;

      container.style.width = slides.length * 100 + '%';
    });
  }

  setSlideshow() {
    const slide = document.querySelector('.slideshow .slide') as HTMLElement;
    const prevBtn = document.querySelector('.slideshow .prev-btn') as HTMLElement;
    const nextBtn = document.querySelector('.slideshow .next-btn') as HTMLElement;
    const ww = window.innerWidth;
    const containerWidth = this.getSlideshow().size = Math.round((ww - 5) * 0.395);
    const containerHeight = containerWidth * 0.75;
    const btnWidth = ww * 0.05;
    const btnHeight = btnWidth * 1.04;

    slide.style.cursor = 'zoom-in';
    prevBtn.style.top = nextBtn.style.top = ((containerHeight - btnHeight) * 0.5 + 140) + 'px';
    prevBtn.style.left = (ww * 0.1 + containerWidth * 0.03) + 'px';
    nextBtn.style.left = (ww * 0.1 + containerWidth - btnWidth - containerWidth * 0.03) + 'px';
  }
  
  getSlideshow(type = '.slideshow') {
    return type == '.slideshow' ? this.slideshow : this.asideSlideshow;
  }

  move(type = '.slideshow', transition = 'transform 0.4s ease-in-out') {
    const track = document.querySelector(type + ' .carousel .track') as HTMLElement;
    const frame = document.querySelector(type + ' .frame') as HTMLElement;

    track.style.transition = frame.style.transition = transition;
    track.style.transform = 'translateX(' + (-this.getSlideshow(type).size * this.getSlideshow(type).index) + 'px)';
    frame.style.transform = 'translate(' + ((this.getSlideshow(type).frameSize + 1) * (this.getSlideshow(type).index + 1) + 1) + 'px, -2px)';
  }

  scrollFrame(type) {
    const imgs = document.querySelectorAll(type + ' .img') as NodeListOf<Element>;
    const gallery = document.querySelector(type + ' .gallery') as HTMLElement;
    const ww = window.innerWidth;
    const visibleImgCount = Math.round(ww / (this.getSlideshow(type).frameSize + 1));

    gallery.scrollBy(-(this.getSlideshow(type).frameSize + 1) * (imgs.length - visibleImgCount), 0);
    gallery.scrollBy((this.getSlideshow(type).frameSize + 1) * (this.getSlideshow(type).index - Math.round(visibleImgCount / 2) + 1), 0);
  }

  prev(type = '.slideshow') {
    if (this.getSlideshow(type).index <= 0) return;
    this.getSlideshow(type).index--;
    this.move(type);
    this.scrollFrame(type);
  }

  next() {
    const slides = document.querySelectorAll('.slideshow .slide') as NodeListOf<Element>;

    if (this.index >= slides.length - 1) return;
    this.index++;
    this.move();
    this.scrollFrame();
  }

  showArrow() {
    const slides = document.querySelectorAll('.slideshow .slide') as NodeListOf<Element>;
    const prevBtn = document.querySelector('.slideshow .prev-btn') as HTMLElement;
    const nextBtn = document.querySelector('.slideshow .next-btn') as HTMLElement;

    if (this.index > 0) prevBtn.style.display = 'inline';
    if (this.index < slides.length - 1) nextBtn.style.display = 'inline';
  }

  hideArrow() {
    const prevBtn = document.querySelector('.slideshow .prev-btn') as HTMLElement;
    const nextBtn = document.querySelector('.slideshow .next-btn') as HTMLElement;

    prevBtn.style.display = nextBtn.style.display = 'none';
  }

  moved() {
    const slides = document.querySelectorAll('.slideshow .slide') as NodeListOf<Element>;
    const prevBtn = document.querySelector('.slideshow .prev-btn') as HTMLElement;
    const nextBtn = document.querySelector('.slideshow .next-btn') as HTMLElement;

    this.showArrow();

    if (this.index == 0) prevBtn.style.display = 'none';
    if (this.index == slides.length - 1) nextBtn.style.display = 'none';
  }

  openGallery() {
    const body = document.querySelector('body');
    const slideshow = document.querySelector('.slideshow') as HTMLElement;
    const carousel = document.querySelector('.slideshow .carousel') as HTMLElement;
    const slides = document.querySelectorAll('.slideshow .slide') as NodeListOf<HTMLElement>;
    const gallery = document.querySelector('.slideshow .gallery') as HTMLElement;
    const track = document.querySelector('.slideshow .gallery .track') as HTMLElement;
    const imgs = document.querySelectorAll('.slideshow .img') as NodeListOf<HTMLElement>;
    const closeBtn = document.querySelector('.slideshow .close-btn') as HTMLElement;
    const prevBtn = document.querySelector('.slideshow .prev-btn') as HTMLElement;
    const nextBtn = document.querySelector('.slideshow .next-btn') as HTMLElement;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const btnWidth = ww * 0.05;

    this.isOpenGallery = true;

    body.style.overflowY = 'hidden';
    slideshow.style.position = 'fixed';
    slideshow.style.zIndex = '103';
    slideshow.style.top = slideshow.style.left = slideshow.style.margin = slideshow.style.padding = '0';
    slideshow.style.background = 'black';
    slideshow.style.width = '100vw';
    slideshow.style.height = '100vh';
    closeBtn.style.display = 'inline';
    closeBtn.style.height = closeBtn.clientWidth + 'px';
    carousel.style.height = '90%';

    this.size = Math.round(carousel.clientHeight * 4/3);

    carousel.style.width = this.size + 'px';
    prevBtn.style.top = nextBtn.style.top = (carousel.clientHeight - btnWidth) * 0.5 + 'px';
    prevBtn.style.left = ((ww - carousel.clientWidth) * 0.5 + carousel.clientWidth * 0.03) + 'px';
    nextBtn.style.left = ((ww - carousel.clientWidth) * 0.5 + carousel.clientWidth * (1 - 0.03) - btnWidth) + 'px';
    slides.forEach(s => s.style.cursor = 'auto');
    gallery.style.display = 'flex';
    gallery.style.height = (wh - carousel.clientHeight - 5) + 'px';
    track.style.height = (wh - carousel.clientHeight - 15) + 'px';
    this.sizeFrame = Math.round(track.clientHeight * 4/3);
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].style.width = this.sizeFrame + 'px';
      if (i > 0 && i < imgs.length - 1) imgs[i].style.marginRight = '1px';
    }
    if (track.clientWidth < ww) gallery.style.justifyContent = 'center';
    track.style.transform = 'translateX(' + (-this.sizeFrame * (track.clientWidth < ww ? 0.5 : 1)) + 'px)';

    this.move('none');
    this.scrollFrame();
  }

  selectImg(event: any) {
    const track = document.querySelector('.gallery-track') as HTMLElement;
    const imgs = Array.from(track.children);
    const targetImg = event.target.closest('li');

    if (!targetImg) return;

    const targetIndex = imgs.findIndex(img => img == targetImg);

    if (targetIndex < 1) return;
    this.index = targetIndex - 1;
    this.move();
    this.scrollFrame();
  }

  closeGallery() {
    const body = document.querySelector('body');
    const slideshow = document.querySelector('.slideshow') as HTMLElement;
    const carousel = document.querySelector('.carousel') as HTMLElement;
    const slides = document.querySelectorAll('.carousel-slide') as NodeListOf<HTMLElement>;
    const gallery = document.querySelector('.gallery') as HTMLElement;
    const closeBtn = document.getElementById('close-btn');

    this.isOpenGallery = false;
    this.setSlideshow();

    body.style.overflowY = 'visible';
    slideshow.style.position = 'static';
    slideshow.style.zIndex = '0';
    slideshow.style.width = this.size + 'px';
    slideshow.style.margin = '10px 0.5% 0 10%';
    slideshow.style.height = carousel.style.height = 'auto';
    slides.forEach(s => s.style.cursor = 'zoom-in');

    this.move(closeBtn.style.display = gallery.style.display = 'none');
  }

  //#endregion Slideshow

  //#region Order

  reloadSlideshow() {
    if (this.product.slideshows.length && this.product.slideshows.filter(s => s.color == this.preview.color.value).length && this.product.slideshows.filter(s => s.color == this.preview.color.value)[0].imgs) this.paths = this.product.slideshows.filter(s => s.color == this.preview.color.value)[0].imgs.map(i => i.path);
    this.move('none');
  }

  onCheckColor(color) {
    this.preview.color = this.order.color = JSON.parse(JSON.stringify(color));

    this.reloadSlideshow();
  }

  previewColor(color) {
    this.preview.color = JSON.parse(JSON.stringify(color));

    this.reloadSlideshow();
  }

  resetColor() {
    this.preview.color = this.order.color;
    
    this.reloadSlideshow();
  }

  updatePrice() {
    this.order.price = this.helperService.sum(this.order.properties.map(p => p.option.price), this.product.price);
    this.priceFormatted = this.helperService.USDcurrency(this.order.price);
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

  //#region Slideshow Editor

  isSaveSlideshow() {
    return this.product.slideshows.length && this.product.slideshows.filter(s => s.color == this.preview.color.value).length && this.product.slideshows.filter(s => s.color == this.preview.color.value)[0].imgs ? JSON.stringify(this.product.slideshows.filter(s => s.color == this.preview.color.value)[0].imgs.map(i => i.path)) != JSON.stringify(this.paths) : this.paths.length;
  }

  saveSlideshow() {
    this.authService.getInfo().subscribe(
      res => {
        if ((res['user'].role == 'root' || res['user'].role === 'admin') && this.isSaveSlideshow()) {
          const formData = new FormData();

          let index = this.product.slideshows.length && this.product.slideshows.filter(s => s.color == this.order.color.value).length && this.product.slideshows.filter(s => s.color == this.order.color.value)[0].imgs.length ? Math.max(...this.product.slideshows.filter(s => s.color == this.order.color.value)[0].imgs.map(i => i.index)) + 1 : 0;
          const indexs = [], paths = [];

          formData.append('color', this.order.color.value);

          this.paths.forEach(p => {
            if (this.helperService.isBase64(p, 'jpeg')) {
              const file = new File([ this.helperService.base64ToBlob(p, 'jpeg') ], 'img.jpeg', { type: 'image/jpeg' });
              formData.append('files', file, index + '.jpeg');
              
              indexs.push(index);
              p = environment.imageUrl + '/?image=product/' + this.id + '/slideshow/' + (this.order.color.value ? this.order.color.value.replace(/#/, '') + '/' : '') + index++ + '.jpeg';
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
                err => alert(err.error.msg)
              );
            },
            err => alert(err.error.msg)
          );
        }
      },
      err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); }
    );
  }

  cancelSaveSlideshow() {
    this.authService.getInfo().subscribe(
      res => {
        if (res['user'].role == 'root' || res['user'].role === 'admin') {
          if (confirm('Do you want to cancel?')) {
            this.onCheckColor(this.order.color);
            this.setCarousel();
          }
        }
      },
      err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); });
  }

  //#endregion Slideshow Editor

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
    this.setCarousel();
  }

  delete(event: any) {
    const targetBtn = event.target.closest('button');
    const gridBoxBtn = document.querySelectorAll('.grid-box button') as NodeListOf<HTMLElement>;
    const btns = Array.from(gridBoxBtn);

    if (!targetBtn) return;

    const targetIndex = btns.findIndex(i => i == targetBtn);

    if (confirm('Are you sure delete: Image ' + (targetIndex + 1) + '?')) {
      this.paths.splice(targetIndex, 1);
      
      this.index = 0;
      this.move('none');
      this.setCarousel();
    }
  }

  cancel() {
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  //#endregion Image Cropper

  //#region Drag and drop

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.placeholder) {
        let phElement = this.placeholder.element.nativeElement;
  
        phElement.style.display = 'none';
        phElement.parentElement.removeChild(phElement);
      }
    }, 500);
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
    if (!this.target) return;

    let phElement = this.placeholder.element.nativeElement;
    let parent = phElement.parentElement;

    phElement.style.display = 'none';
    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

    this.target = this.source = null;

    if (this.sourceIndex != this.targetIndex) moveItemInArray(this.paths, this.sourceIndex, this.targetIndex);
  }

  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop == this.placeholder) return true;
    if (drop != this.activeContainer) return false;

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
    dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex ? dropElement.nextSibling : dropElement));

    this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
    return false;
  }
  
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    const point = __isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    const scrollPosition = this.viewportRuler.getViewportScrollPosition();

    return { x: point.pageX - scrollPosition.left, y: point.pageY - scrollPosition.top };
  }

  //#endregion Drag and drop

  //#region Post Editor

  setPost() {
    const postContainer = document.getElementById('post-container') as HTMLElement;

    this.post.content = this.product.post ? this.product.post.content : '<p style=\"text-align: center;\"><strong><span style=\"font-size: 36pt; color: red;\">' + this.product.name + '</span></strong></p><p style=\"text-align: center;\"><span style=\"font-size: 18pt;\">Content</span></p><p style=\"text-align: center;\"><span style=\"font-size: 18pt;\"><img src=\"' + this.product.img.path + '\" class=\"e-rte-image e-imginline e-resize\" alt=\"' + this.product.name + '\" width=\"auto\" height=\"auto\" style=\"min-width: 0px; min-height: 0px;\"> </span></p><p style=\"text-align: center;\"><span style=\"font-size: 18pt;\"></span></p>';
    if (this.product.post && this.product.post.content) postContainer.innerHTML = this.product.post.content;
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
          
                  this.ngOnInit();
                },
                err => alert(err.error.msg)
              );
            },
            err => alert(err.error.msg)
          );
        }
      },
      err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); }
    );
  }

  cancelSavePost() {
    this.authService.getInfo().subscribe(res => { if (res['user'].role == 'root' || res['user'].role === 'admin') if (confirm('Do you want to cancel?')) this.setPost(); }, err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); });
  }

  //#endregion Post Editor

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
      for (const f of files) {
        const reader = new FileReader();

        reader.onload = event => this.review.imgs.push(event.target.result);
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
                
                this.review.index = this.product.reviews.length ? this.product.reviews[this.product.reviews.length - 1].index + 1 : 0;

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
        err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); }
      );
    } else if (confirm('Do you want to login?')) window.open('login');
  }

  deleteReviewImg(event: any) {
    const targetBtn = event.target.closest('button');
    const reviewImgsBarBtn = document.querySelectorAll('.review-imgs-bar button') as NodeListOf<HTMLElement>;
    const btns = Array.from(reviewImgsBarBtn);

    if (!targetBtn) return;

    const targetIndex = btns.findIndex(i => i == targetBtn);

    if (confirm('Are you sure delete: Image ' + (targetIndex + 1) + '?')) {
      this.review.files.splice(targetIndex, 1);
      this.review.imgs.splice(targetIndex, 1);
    };
  }

  //#endregion Review

  //#region Reviews

  setReviews() {
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
        err => console.warn(err.error.msg)
      );
    });
  }

  deleteReview(r: Object) {
    if (confirm('Are you sure delete: ' + JSON.stringify(r) + '?')) {
      this.reviews.splice(this.reviews.indexOf(r), 1);
      this.productService.deleteReview(this.id, r, this.reviews).subscribe(res => alert(res['msg']), err => alert(err.error.msg));
      this.ngOnInit();
    }
  }

  filterStar(star: any) {
    this.indexStar = star.index;
    this.reviews = this.product.reviews.filter(e => e.star == star.index);
  }

  showReviews() {
    this.indexStar = undefined;
    this.reviews = this.product.reviews;
  }

  //#endregion Reviews

  //#region Comment

  sendComment() {
    if (this.authService.getToken()) {
      this.authService.getInfo().subscribe(
        res => {
          this.comment.user.username = res['user'].username;

          if (res['user'].role == 'user') {
            this.productService.getProduct(this.id).subscribe(
              res => {
                this.product = res['product'];
                
                this.comment.index = this.product.comments.length ? this.product.comments[this.product.comments.length - 1].index + 1 : 0;

                this.productService.sendComment(this.id, this.comment, this.comment.files).subscribe(
                  res => {
                    alert(res['msg']);

                    this.comment = {
                      index: 0,
                      user: {
                        username: ''
                      },
                      content: '',
                      img: [],
                      imgs: [],
                      files: []
                    }

                    this.ngOnInit();
                  },
                  err => alert(err.error.msg)
                );
              },
              err => alert(err.error.msg)
            );
          } else alert('Only users can comment this product.');
        },
        err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); }
      );
    } else if (confirm('Do you want to login?')) window.open('login');
  }

  enterCommentCamera() {
    const reviewCamera = document.getElementById('cmt-camera') as HTMLElement;

    reviewCamera.style.fill = 'white';
  }

  leaveCommentCamera() {
    const reviewCamera = document.getElementById('cmt-camera') as HTMLElement;

    reviewCamera.style.fill = 'black';
  }

  selectCommentFileInput(files) {
    if (files.length) {
      this.comment.files.push(...files);
      for (const f of files) {
        const reader = new FileReader();

        reader.onload = event => this.comment.imgs.push(event.target.result);
        reader.readAsDataURL(f);
      }
    }
  }
  
  deleteCommentImg(event: any) {
    const targetBtn = event.target.closest('button');
    const reviewImgsBarBtn = document.querySelectorAll('.cmt-imgs-bar button') as NodeListOf<HTMLElement>;
    const btns = Array.from(reviewImgsBarBtn);

    if (!targetBtn) return;

    const targetIndex = btns.findIndex(i => i == targetBtn);

    if (confirm('Are you sure delete: Image ' + (targetIndex + 1) + '?')) {
      this.comment.files.splice(targetIndex, 1);
      this.comment.imgs.splice(targetIndex, 1);
    };
  }

  deleteComment(c: Object) {
    if (confirm('Are you sure delete: ' + JSON.stringify(c) + '?')) {
      this.comments.splice(this.comments.indexOf(c), 1);
      this.productService.deleteComment(this.id, c, this.comments).subscribe(res => alert(res['msg']), err => alert(err.error.msg));
      
      this.ngOnInit();
    }
  }

  //#endregion Comment

  //#region Comments

  setComments() {
    this.product.comments.forEach(c => {
      this.userService.getUser(c.user.username).subscribe(res => c.user = res['user'], err => console.warn(err.error.msg));
      if (c.answers) c.answers.forEach(a => this.userService.getUser(a.user.username).subscribe(res => a.user = res['user'], err => console.warn(err.error.msg)));
    });
  }

  //#endregion Comments

  //#region Reply

  sendAnswer(comment: Object) {
    if (this.authService.getToken()) {
      this.authService.getInfo().subscribe(
        res => {
          this.answer.user.username = res['user'].username;

          this.productService.getProduct(this.id).subscribe(
            res => {
              this.product = res['product'];
              
              this.answer.index = this.comments.length && this.comments[this.comments.indexOf(comment)].answers && this.comments[this.comments.indexOf(comment)].answers.length ? this.comments[this.comments.indexOf(comment)].answers[this.comments[this.comments.indexOf(comment)].answers.length - 1].index + 1 : 0;

              this.productService.sendAnswer(this.id, comment, this.answer, this.answer.files).subscribe(
                res => {
                  alert(res['msg']);

                  this.answer = {
                    index: 0,
                    user: {
                      username: ''
                    },
                    content: '',
                    img: [],
                    imgs: [],
                    files: []
                  }

                  this.ngOnInit();
                },
                err => alert(err.error.msg)
              );
            },
            err => alert(err.error.msg)
          );
        },
        err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); }
      );
    } else if (confirm('Do you want to login?')) window.open('login');
  }

  reply(cmt: Object) {
    this.indexAnswer = Object(cmt).index;
  }
  
  enterReplyCamera() {
    const replyCamera = document.getElementById('reply-camera') as HTMLElement;

    replyCamera.style.fill = 'white';
  }

  leaveReplyCamera() {
    const replyCamera = document.getElementById('reply-camera') as HTMLElement;

    replyCamera.style.fill = 'black';
  }

  selectReplyFileInput(files) {
    if (files.length) {
      this.answer.files.push(...files);

      for (const f of files) {
        let reader = new FileReader();

        reader.onload = event => this.answer.imgs.push(event.target.result);

        reader.readAsDataURL(f);
      }
    }
  }

  deleteReplyImg(event: any) {
    const targetBtn = event.target.closest('button');
    const replyImgsBarBtn = document.querySelectorAll('.reply-imgs-bar button') as NodeListOf<HTMLElement>;
    const btns = Array.from(replyImgsBarBtn);

    if (!targetBtn) return;
    
    const targetIndex = btns.findIndex(i => i == targetBtn);

    if (confirm('Are you sure delete: Image ' + (targetIndex + 1) + '?')) {
      this.answer.files.splice(targetIndex, 1);
      this.answer.imgs.splice(targetIndex, 1);
    };
  }

  deleteAnswer(a: Object, c: Object) {
    if (confirm('Are you sure delete: ' + JSON.stringify(a) + '?')) {
      this.comments[this.comments.indexOf(c)].answers.splice(this.comments[this.comments.indexOf(c)].answers.indexOf(a), 1);
      this.productService.deleteAnswer(this.id, this.comments, c, a).subscribe(res => alert(res['msg']), err => alert(err.error.msg));
      
      this.ngOnInit();
    }
  }

  //#endregion Reply

  //#region Aside Gallery

  showAsideGallery(event: any, msg: Object) {
    const slideshow = document.querySelector('.aside-slideshow') as HTMLElement;
    const asideGalleryContainer = document.getElementById('aside-gallery-container') as HTMLElement;
    const asideCarouselSlide = document.getElementsByClassName('aside-carousel-slide') as HTMLCollectionOf<HTMLElement>;
    const asideCloseBtn = document.getElementById('aside-close-btn') as HTMLElement;
    const asideCarouselImg = document.getElementsByClassName('aside-carousel-img') as HTMLCollectionOf<HTMLElement>;
    const asideGalleryCarouselNav = document.querySelector('.aside-gallery-carousel-nav') as HTMLElement;
    const imgsBar = event.target.closest('span.imgs-bar');
    const boxs = Array.from(imgsBar.children);
    const targetBox = event.target.closest('span');

    this.isShowAsideGallery = true;

    this.asideEvent = event;
    this.asideGallery.stars = Object(msg).stars;
    this.asideGallery.content = Object(msg).content;
    this.asideGallery.imgs = Object(msg).imgs;

    slideshow.style.display = 'flex';

    asideCloseBtn.style.display = 'inline';

    if (!targetBox) return;
    const targetIndex = boxs.findIndex(box => box == targetBox);
    if (targetIndex < 0) return;

    if (!this.resize) this.asideCounter = targetIndex;

    asideGalleryCarouselNav.style.position = 'absolute';
    asideGalleryCarouselNav.style.display = 'flex';
    asideGalleryCarouselNav.style.bottom = '0';

    setTimeout(() => {
      const asideGalleryCarouselImgs = document.querySelectorAll('.aside-gallery-carousel-nav img') as NodeListOf<HTMLElement>;
      const asideGalleryFrame = document.querySelector('.aside-gallery-frame') as HTMLElement;

      for (let i = 0; i < asideCarouselImg.length; i++) {
        if (asideCarouselImg[i].clientHeight > asideCarouselImg[i].clientWidth) asideCarouselImg[i].style.height = '100%';
        else asideCarouselImg[i].style.width = '100%';
        asideCarouselImg[i].style.cursor = 'auto';
      }
      this.asideSize = asideCarouselSlide[0].offsetWidth;

      for (let i = 0; i < asideCarouselSlide.length; i++) asideCarouselSlide[i].style.transition = 'none';
      for (let i = 0; i < asideCarouselSlide.length; i++) asideCarouselSlide[i].style.transform = 'translateX(' + (-this.asideSize * this.asideCounter) + 'px)';
      
      this.asideSizeFrame = Math.round(asideGalleryCarouselNav.clientHeight * (asideCarouselSlide[0].clientWidth / asideCarouselSlide[0].clientHeight));

      for (let i = 0; i < asideGalleryCarouselImgs.length; i++) {
        asideGalleryCarouselImgs[i].style.width = this.asideSizeFrame + 'px';
        if (i > 0 && i < asideGalleryCarouselImgs.length - 1) asideGalleryCarouselImgs[i].style.marginRight = '1px';
      }

      if (this.asideSizeFrame * asideGalleryCarouselImgs.length >= asideCarouselSlide[0].offsetWidth) {
        asideGalleryCarouselNav.style.width = asideCarouselSlide[0].offsetWidth + 'px';
        asideGalleryCarouselNav.style.left = asideCarouselSlide[0].offsetWidth / 6 + 'px';
      } else {
        asideGalleryCarouselNav.style.width = 'auto';
        asideGalleryCarouselNav.style.left = (asideCarouselSlide[0].offsetWidth / 6 + (asideCarouselSlide[0].offsetWidth - (this.asideSizeFrame + 1) * (asideGalleryCarouselImgs.length - 1)) / 2 - asideGalleryCarouselImgs.length) + 'px';
      }

      for (let i = 0; i < asideGalleryCarouselImgs.length; i++) {
        asideGalleryCarouselImgs[i].style.bottom = '0';
        asideGalleryCarouselImgs[i].style.transition = 'none';
        if (i > 0) asideGalleryCarouselImgs[i].style.transform = 'translate(' + (-(this.asideSizeFrame + 1)) + 'px, 2px)';
      }

      asideGalleryFrame.style.transition = 'none';
      asideGalleryFrame.style.zIndex = '1';
      asideGalleryFrame.style.transform = 'translateX(' + (this.asideCounter == 0 ? 1 : (this.asideSizeFrame + 1) * this.asideCounter + 1) + 'px)';

      this.asideScrollFrame();
    });

  }

  closeAsideGallery() {
    const reviewgallerycontainer = document.getElementById('aside-gallery-container') as HTMLElement;

    reviewgallerycontainer.style.display = 'none';
    this.resize = false;
    this.isShowAsideGallery = false;
  }

  asidePrev() {
    const asideCarouselSlide = document.getElementsByClassName('aside-carousel-slide') as HTMLCollectionOf<HTMLElement>;
    const asideGalleryFrame = document.querySelector('.aside-gallery-frame') as HTMLElement;

    if (this.asideCounter <= 0) return;

    for (let i = 0; i < asideCarouselSlide.length; i++) asideCarouselSlide[i].style.transition = 'transform 0.4s ease-in-out';
    asideGalleryFrame.style.transition = 'transform 0.4s ease-in-out';
    this.asideCounter--;
    for (let i = 0; i < asideCarouselSlide.length; i++) asideCarouselSlide[i].style.transform = 'translateX(' + (-this.asideSize * this.asideCounter) + 'px)';
    asideGalleryFrame.style.transform = 'translateX(' + ((this.asideSizeFrame + 1) * this.asideCounter + 1) + 'px)';

    this.asideScrollFrame();
  }

  asideNext() {
    const asideCarouselSlide = document.getElementsByClassName('aside-carousel-slide') as HTMLCollectionOf<HTMLElement>;
    const asideCarouselImg = document.getElementsByClassName('aside-carousel-img') as HTMLCollectionOf<HTMLElement>;
    const asideGalleryFrame = document.querySelector('.aside-gallery-frame') as HTMLElement;

    if (this.asideCounter >= asideCarouselImg.length - 1) return;
    
    for (let i = 0; i < asideCarouselSlide.length; i++) asideCarouselSlide[i].style.transition = 'transform 0.4s ease-in-out';
    asideGalleryFrame.style.transition = 'transform 0.4s ease-in-out';
    this.asideCounter++;
    for (let i = 0; i < asideCarouselSlide.length; i++) asideCarouselSlide[i].style.transform = 'translateX(' + (-this.asideSize * this.asideCounter) + 'px)';
    asideGalleryFrame.style.transform = 'translateX(' + ((this.asideSizeFrame + 1) * this.asideCounter + 1) + 'px)';

    this.asideScrollFrame();
  }

  selectAsideImg(event: any) {
    const asideCarouselSlide = document.getElementsByClassName('aside-carousel-slide') as HTMLCollectionOf<HTMLElement>;
    const asideGalleryCarouselNav = document.querySelector('.aside-gallery-carousel-nav') as HTMLElement;
    const asideGalleryFrame = document.querySelector('.aside-gallery-frame') as HTMLElement;
    const imgs = Array.from(asideGalleryCarouselNav.children);
    const targetImg = event.target.closest('img');

    if (!targetImg) return;

    const targetIndex = imgs.findIndex(img => img == targetImg);

    if (targetIndex < 0) return;

    for (let i = 0; i < asideCarouselSlide.length; i++) asideCarouselSlide[i].style.transition = 'transform 0.4s ease-in-out';
    asideGalleryFrame.style.transition = 'transform 0.4s ease-in-out';

    this.asideCounter = targetIndex - 1;

    for (let i = 0; i < asideCarouselSlide.length; i++) asideCarouselSlide[i].style.transform = 'translateX(' + (-this.asideSize * this.asideCounter) + 'px)';
    asideGalleryFrame.style.transform = 'translateX(' + ((this.asideSizeFrame + 1) * this.asideCounter + 1) + 'px)';

    this.asideScrollFrame();
  }

  asideMoved() {
    const asideCarouselImg = document.getElementsByClassName('aside-carousel-img') as HTMLCollectionOf<HTMLElement>;
    const reviewPrevBtn = document.getElementById('aside-prev-btn');
    const reviewNextBtn = document.getElementById('aside-next-btn');

    this.resize = false;

    this.showAsideArrow();

    if (this.asideCounter == 0) reviewPrevBtn.style.display = 'none';
    if (this.asideCounter == asideCarouselImg.length - 1) reviewNextBtn.style.display = 'none';
  }

  asideScrollFrame() {
    const asideCarouselSlide = document.getElementsByClassName('aside-carousel-slide') as HTMLCollectionOf<HTMLElement>;
    const reviewCarouselImages = document.getElementsByClassName('aside-carousel-img') as HTMLCollectionOf<HTMLElement>;
    const asideGalleryCarouselNav = document.querySelector('.aside-gallery-carousel-nav') as HTMLElement;

    const framCount = reviewCarouselImages.length;
    const visibleFramCount = Math.round(asideCarouselSlide[0].offsetWidth / (this.asideSizeFrame + 1));

    asideGalleryCarouselNav.scrollBy(-(this.asideSizeFrame + 1) * (framCount - visibleFramCount), 0);
    asideGalleryCarouselNav.scrollBy((this.asideSizeFrame + 1) * (this.asideCounter - Math.round(visibleFramCount / 2) + 1), 0);
  }

  hideAsideArrow() {
    const reviewPrevBtn = document.getElementById('aside-prev-btn') as HTMLElement;
    const reviewNextBtn = document.getElementById('aside-next-btn') as HTMLElement;

    reviewPrevBtn.style.display = reviewNextBtn.style.display = 'none';
  }

  showAsideArrow() {
    const asideCarouselImg = document.getElementsByClassName('aside-carousel-img') as HTMLCollectionOf<HTMLElement>;
    const reviewPrevBtn = document.getElementById('aside-prev-btn') as HTMLElement;
    const reviewNextBtn = document.getElementById('aside-next-btn') as HTMLElement;

    if (this.asideCounter > 0) reviewPrevBtn.style.display = 'inline';
    if (this.asideCounter < asideCarouselImg.length - 1) reviewNextBtn.style.display = 'inline';
  }

  //#endregion Aside Gallery

}

//#region Helpers

const __indexOf = (collection, node) => Array.prototype.indexOf.call(collection, node);

const __isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent =>  event.type.startsWith('touch');

const __isInsideDropListClientRect = (dropList: CdkDropList, x: number, y: number) => {
  const { top, bottom, left, right } = dropList.element.nativeElement.getBoundingClientRect();
  return y >= top && y <= bottom && x >= left && x <= right; 
}

//#endregion Helpers
