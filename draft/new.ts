
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

  @HostListener('window:resize')
  onResize() {
    if (this.slideshow.isOpenGallery) this.openGallery();
    if (!this.slideshow.isOpenGallery) this.closeGallery();
    // this.resize = true;

    // if (leftContainer.style.getPropertyValue('position') == 'fixed') this.showGallery();
    // else if (closeBtn.style.getPropertyValue('display') == 'none') this.closeGallery();

    // if (this.isShowAsideGallery) this.showAsideGallery(this.asideEvent, this.asideGallery);
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

  next(type = '.slideshow') {
    const slides = document.querySelectorAll(type + ' .slide') as NodeListOf<Element>;

    if (this.getSlideshow(type).index >= slides.length - 1) return;
    this.getSlideshow(type).index++;
    this.move(type);
    this.scrollFrame(type);
  }

  showArrow(type = '.slideshow') {
    const slides = document.querySelectorAll(type + ' .slide') as NodeListOf<Element>;
    const prevBtn = document.querySelector(type + ' .prev-btn') as HTMLElement;
    const nextBtn = document.querySelector(type + ' .next-btn') as HTMLElement;

    if (this.getSlideshow(type).index > 0) prevBtn.style.display = 'inline';
    if (this.getSlideshow(type).index < slides.length - 1) nextBtn.style.display = 'inline';
  }

  hideArrow(type = '.slideshow') {
    const prevBtn = document.querySelector(type + ' .prev-btn') as HTMLElement;
    const nextBtn = document.querySelector(type + ' .next-btn') as HTMLElement;

    prevBtn.style.display = nextBtn.style.display = 'none';
  }

  moved(type = '.slideshow') {
    const slides = document.querySelectorAll(type + ' .slide') as NodeListOf<Element>;
    const prevBtn = document.querySelector(type + ' .prev-btn') as HTMLElement;
    const nextBtn = document.querySelector(type + ' .next-btn') as HTMLElement;

    this.showArrow();

    if (this.getSlideshow(type).index == 0) prevBtn.style.display = 'none';
    if (this.getSlideshow(type).index == slides.length - 1) nextBtn.style.display = 'none';
  }

  openGallery(type = '.slideshow', event: any = null, msg: Object = null) {
    const body = document.querySelector('body');
    const slideshow = document.querySelector(type) as HTMLElement;
    const carousel = document.querySelector(type + ' .carousel') as HTMLElement;
    const slides = document.querySelectorAll(type + ' .slide') as NodeListOf<HTMLElement>;
    const gallery = document.querySelector(type + ' .gallery') as HTMLElement;
    const track = document.querySelector(type + ' .gallery .track') as HTMLElement;
    const imgs = document.querySelectorAll(type + ' .img') as NodeListOf<HTMLElement>;
    const closeBtn = document.querySelector(type + ' .close-btn') as HTMLElement;
    const prevBtn = document.querySelector(type + ' .prev-btn') as HTMLElement;
    const nextBtn = document.querySelector(type + ' .next-btn') as HTMLElement;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const btnWidth = ww * 0.05;

    this.getSlideshow(type).isOpenGallery = true;

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

    this.getSlideshow(type).size = Math.round(carousel.clientHeight * 4/3);

    carousel.style.width = this.getSlideshow(type).size + 'px';
    prevBtn.style.top = nextBtn.style.top = (carousel.clientHeight - btnWidth) * 0.5 + 'px';
    prevBtn.style.left = ((ww - carousel.clientWidth) * 0.5 + carousel.clientWidth * 0.03) + 'px';
    nextBtn.style.left = ((ww - carousel.clientWidth) * 0.5 + carousel.clientWidth * (1 - 0.03) - btnWidth) + 'px';
    slides.forEach(s => s.style.cursor = 'auto');
    gallery.style.display = 'flex';
    gallery.style.height = (wh - carousel.clientHeight - 5) + 'px';
    track.style.height = (wh - carousel.clientHeight - 15) + 'px';
    this.getSlideshow(type).frameSize = Math.round(track.clientHeight * 4/3);
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].style.width = this.getSlideshow(type).frameSize + 'px';
      if (i > 0 && i < imgs.length - 1) imgs[i].style.marginRight = '1px';
    }
    if (track.clientWidth < ww) gallery.style.justifyContent = 'center';
    track.style.transform = 'translateX(' + (-this.getSlideshow(type).frameSize * (track.clientWidth < ww ? 0.5 : 1)) + 'px)';

    this.move(type, 'none');
    this.scrollFrame(type);
  }

  selectImg(event: any, type = '.slideshow') {
    const track = document.querySelector(type + ' .gallery .track') as HTMLElement;
    const imgs = Array.from(track.children);
    const targetImg = event.target.closest('li');

    if (!targetImg) return;

    const targetIndex = imgs.findIndex(img => img == targetImg);

    if (targetIndex < 1) return;
    this.getSlideshow(type).index = targetIndex - 1;
    this.move(type);
    this.scrollFrame(type);
  }

  closeGallery(type = '.slideshow') {
    const body = document.querySelector('body');
    const slideshow = document.querySelector(type) as HTMLElement;
    const carousel = document.querySelector(type + ' .carousel') as HTMLElement;
    const slides = document.querySelectorAll(type + ' .slide') as NodeListOf<HTMLElement>;
    const gallery = document.querySelector(type + ' .gallery') as HTMLElement;
    const closeBtn = document.querySelector(type + ' .close-btn') as HTMLElement;

    this.getSlideshow(type).isOpenGallery = false;
    this.setSlideshow();

    body.style.overflowY = 'visible';
    slideshow.style.position = 'static';
    slideshow.style.zIndex = '0';
    slideshow.style.width = this.getSlideshow(type).size + 'px';
    slideshow.style.margin = '10px 0.5% 0 10%';
    slideshow.style.height = carousel.style.height = 'auto';
    slides.forEach(s => s.style.cursor = 'zoom-in');

    this.move(type, closeBtn.style.display = gallery.style.display = 'none');
  }

  reloadSlideshow() {
    this.paths = [];
    if (this.product.slideshows.length && this.product.slideshows.filter(s => s.color == this.preview.color.value).length && this.product.slideshows.filter(s => s.color == this.preview.color.value)[0].imgs) this.paths = this.product.slideshows.filter(s => s.color == this.preview.color.value)[0].imgs.map(i => i.path);
    this.move(undefined, 'none');
  }

  delete(event: any) {
    const targetBtn = event.target.closest('button');
    const gridBoxBtn = document.querySelectorAll('.grid-box button') as NodeListOf<HTMLElement>;
    const btns = Array.from(gridBoxBtn);

    if (!targetBtn) return;

    const targetIndex = btns.findIndex(i => i == targetBtn);

    if (confirm('Are you sure delete: Image ' + (targetIndex + 1) + '?')) {
      this.paths.splice(targetIndex, 1);

      this.getSlideshow().index = 0;
      this.move(undefined, 'none');
      this.setCarousel();
    }
  }
