
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
