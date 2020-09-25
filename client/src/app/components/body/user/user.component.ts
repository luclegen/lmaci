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
  }

  role;
  gender;

  emailRegex;
  mobileNumberRegex;

  tbodyFontSize = 0;

  //#region Img

  imageChangedEvent: any = '';
  croppedImage: any = '';

  //#endregion Img

  @HostListener('window:resize')
  onResize() {
    this.ngOnInit();
  }
  
  constructor(private titleService: Title,
              private route: ActivatedRoute, 
              private authService: AuthService, 
              private userService: UserService,
              private helperService: HelperService,
              private router: Router) {
    this.emailRegex = this.helperService.emailRegex;
    this.mobileNumberRegex = this.helperService.mobileNumberRegex;
  }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    const vpWidth = document.documentElement.clientWidth;
    const thead = document.getElementsByTagName('thead') as HTMLCollectionOf<HTMLTableSectionElement>;
    const tbody = document.getElementsByTagName('tbody') as HTMLCollectionOf<HTMLTableSectionElement>;
  
    for (let i = 0; i < thead.length; i++) thead[i].style.fontSize = vpWidth * 0.03125 + 'px';
    this.tbodyFontSize = vpWidth * 0.025;
    
    this.authService.getInfo().subscribe(
      res => {
        if(res['user'].role === 'root' || res['user'].role === 'admin' || res['user'].username === username) {
          this.userService.getUser(username).subscribe(
            res => {
              this.userDetails = res['user'];
              this.titleService.setTitle(this.userDetails.name.first + this.title);
              this.role = this.userDetails.role.split('')[0].toUpperCase() + this.userDetails.role.split('').slice(1).join('');
              this.gender = this.userDetails.gender.split('')[0].toUpperCase() + this.userDetails.gender.split('').slice(1).join('');
            },
            err => alert(err.error.msg)
          );
        }
      },
      err => this.router.navigateByUrl('')
    );
  }

  //#region Img Cropper

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
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
  }

  onSubmit(form: NgForm) {
    alert('T');
  }

  onCancel() {
    this.edit();
  }

}
