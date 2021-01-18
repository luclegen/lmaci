import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ImageCroppedEvent } from 'ngx-image-cropper';

import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {
  userDetails;
  title = '\'s Profile';
  isEdit = false;
  user = {
    avatar: '',
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    mobileNumber: '',
    address: ''
  };

  username;

  role;
  gender;

  emailRegex;
  mobileNumberRegex;

  //#region Img

  imageChangedEvent: any = '';
  croppedImage: any = '';

  //#endregion Img

  @HostListener('window:resize')
  onResize() {
    this.setTable();
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    return !this.isEdit || !(this.imageChangedEvent || this.user.firstName != this.userDetails.name.first || this.user.lastName != this.userDetails.name.last || this.user.gender != this.userDetails.gender || this.user.email != this.userDetails.email || this.user.mobileNumber != this.userDetails.mobileNumber || this.user.address != this.userDetails.address);
  }

  constructor(private titleService: Title,
              private route: ActivatedRoute, 
              private userService: UserService,
              private helperService: HelperService,
              public authService: AuthService) {
    this.emailRegex = this.helperService.emailRegex;
    this.mobileNumberRegex = this.helperService.mobileNumberRegex;
  }
  
  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    
    this.authService.getInfo().subscribe(
      res => {
        if(res['user'].role === 'root' || res['user'].role === 'admin' || res['user'].username === this.username) {
          this.isUser = res['user'].username === this.username;
          this.userService.getUser(this.username).subscribe(
            res => {
              this.userDetails = res['user'];
              this.titleService.setTitle(this.userDetails.name.first + this.title);
              this.role = this.userDetails.role.split('')[0].toUpperCase() + this.userDetails.role.split('').slice(1).join('');
              this.gender = this.userDetails.gender.split('')[0].toUpperCase() + this.userDetails.gender.split('').slice(1).join('');

              this.setTable();
            },
            err => alert(err.error.msg)
          );
        }
      },
      err => this.router.navigateByUrl('')
    );
  }

  setTable() {
    setTimeout(() => {
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const section = document.querySelectorAll('section') as NodeListOf<HTMLElement>;
      const thead = document.querySelectorAll('thead') as NodeListOf<HTMLTableSectionElement>;
      const tbody = document.querySelectorAll('tbody') as NodeListOf<HTMLTableSectionElement>;

      thead.forEach(i => i.style.fontSize = vw * 0.03125 + 'px');
      tbody.forEach(i => i.style.fontSize = vw * 0.025 + 'px');
      section[1].style.minHeight = (vh - 60 - section[0].clientHeight) + 'px';
    });
  }

  //#region Img Cropper

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  //#endregion Img Cropper

  edit() {
    this.isEdit = !this.isEdit;

    this.user.firstName = this.userDetails.name.first;
    this.user.lastName = this.userDetails.name.last;
    this.user.gender = this.userDetails.gender;
    this.user.email = this.userDetails.email;
    this.user.mobileNumber = this.userDetails.mobileNumber;
    this.user.address = this.userDetails.address;

    this.setTable();
  }

  onSubmit(form: NgForm) {
    this.authService.getInfo().subscribe(
      res => {
        if (res['user'].username == this.username) {
          this.userService.updateUser(this.username, form.value).subscribe(
            res => {
              if (this.croppedImage) {
                const formData = new FormData();

                const file = new File([ this.helperService.base64ToBlob(this.croppedImage, 'png') ], 'img.png', { type: 'image/png' });
                
                formData.append('file', file, this.username + '.png');

                this.userService.uploadAvatar(this.username, formData).subscribe(
                  res => {
                    alert('Update your profile is successfully.');
                    this.imageChangedEvent = '';
                    this.croppedImage = '';
                    location.reload();
                  },
                  err => alert(err.error.msg)
                );
              } else alert('Update your profile is successfully.');
              
              this.isEdit = !this.isEdit;
              this.ngOnInit();
            },
            err => alert(err.error.msg)
          );
        }
      },
      err => { if (err.status == 440 && confirm('Login again?\nYour session has expired and must log in again.')) window.open('/login'); }
    );
  }

  onCancel() {
    if (confirm('Are you sure to cancel?')) {
      this.imageChangedEvent = '';
      this.croppedImage = '';
      this.edit();
    }
  }

}
