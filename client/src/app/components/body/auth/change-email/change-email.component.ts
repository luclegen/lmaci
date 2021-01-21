import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.sass']
})
export class ChangeEmailComponent implements OnInit {

  emailChange: string;
  serverErrorMessages: string;

  emailRegex;

  constructor(private titleService: Title,
              private helperService: HelperService,
              private authService: AuthService,
              private router: Router) {
    this.titleService.setTitle('Change Email | Lmaci');
    this.emailRegex = this.helperService.emailRegex;
  }

  @HostListener('window:resize')
  onResize() {
    this.helperService.setPositionOnlyForm();
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    return !this.emailChange;
  }

  ngOnInit(): void {
    this.helperService.setPositionOnlyForm();
  }

  onSubmit(form: NgForm) {
    if (this.authService.isExpired()) if (confirm('Login again?\nYour session has expired and must log in again.')) window.open('/login');
    if (!this.authService.isExpired()) {
      this.serverErrorMessages = null;
      this.authService.changeEmail(this.authService.getId(), form.value).subscribe(
        res => {
          alert(res['msg']);
          this.router.navigateByUrl('activate');
        },
        err => this.serverErrorMessages = err.error.message
      );
    }
  }

}
