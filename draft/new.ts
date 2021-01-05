
  resetColor() {
    this.isChangeColor = this.preview.color.value != this.order.color.value;
    if (this.isChangeColor) this.preview.color = this.order.color;
    this.reloadSlideshow();
  }
