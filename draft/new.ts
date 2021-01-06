
  onSubmit(form: NgForm) {
    this.serverErrorMessages = null;
    this.successMessages = null;
    if (this.matchPassword()) this.authService.getInfo().subscribe(res => { if (res['user']) this.authService.changePassword(this.authService.getId(), form.value).subscribe(res => this.successMessages = res['msg'], err => this.serverErrorMessages = err.error.msg); }, err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); });
  }
