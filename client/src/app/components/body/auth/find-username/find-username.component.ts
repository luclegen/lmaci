import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-find-username',
  templateUrl: './find-username.component.html',
  styleUrls: ['./find-username.component.sass']
})
export class FindUsernameComponent implements OnInit {

  emailFind: string;
  serverErrorMessages: string;

  emailRegex;

  constructor(private titleService: Title,
              private helperService: HelperService,
              private authService: AuthService,
              private router: Router) {
    this.titleService.setTitle('Find Username | Lmaci');
    this.emailRegex = this.helperService.emailRegex;
  }
  
  @HostListener('window:resize')
  onResize() {
    this.helperService.setPositionOnlyForm();
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    return !this.emailFind;
  }

  ngOnInit(): void {
    this.helperService.setPositionOnlyForm();
  }

  onSubmit(form: NgForm) {
    this.serverErrorMessages = null;
    this.authService.findUsername(form.value).subscribe(
      res => {
        alert(res['msg']);
        this.router.navigateByUrl('reset-password/' + res['username']);
      },
      err => this.serverErrorMessages = err.error.msg
    );
  }

}
