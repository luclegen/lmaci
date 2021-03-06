import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.sass']
})
export class ActivateComponent implements OnInit {
  counter$: Observable<number>;
  count = 60;
  
  verificationCode: '';

  codeRegex;

  serverErrorMessages: string;

  constructor(private titleService: Title,
              private helperService: HelperService,
              private authService: AuthService,
              private router: Router) {
    this.titleService.setTitle('Verify Email | Lmaci');
    
    this.codeRegex = this.helperService.codeRegex;
    
    this.counter$ = timer(0, 1000).pipe(take(this.count), map(() => --this.count));
  }

  @HostListener('window:resize')
  onResize() {
    this.helperService.setPositionOnlyForm();
  }

  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    return !this.verificationCode;
  }

  ngOnInit(): void {
    this.authService.resendActivate(this.authService.getId()).subscribe();
    this.helperService.setPositionOnlyForm();
  }

  onSubmit(form: NgForm) {
    if (this.authService.isExpired()) if (confirm('Login again?\nYour session has expired and must log in again.')) this.router.navigateByUrl('login');
    if (!this.authService.isExpired()) {
      this.serverErrorMessages = null;
      this.authService.activate(this.authService.getId(), form.value).subscribe(
        res => {
          alert(res['msg']);
          this.router.navigateByUrl('user/' + this.authService.getUsername());
        }, err => this.serverErrorMessages = err.error.msg
      );
    }
  }

  resendEmail() {
    if (this.authService.isExpired()) if (confirm('Login again?\nYour session has expired and must log in again.')) this.router.navigateByUrl('login');
    if (!this.authService.isExpired()) {
      this.serverErrorMessages = null;
      this.authService.resendActivate(this.authService.getId()).subscribe(
        res => {
          alert(res['msg']);
          
          this.count = 60;
          this.counter$ = timer(0, 1000).pipe(take(this.count), map(() => --this.count));
        }, err => this.serverErrorMessages = err.error.msg
      );
    }
  }

}
