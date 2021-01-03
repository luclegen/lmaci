
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
