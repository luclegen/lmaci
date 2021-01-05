import { Component, HostListener, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Observable, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.sass']
})
export class ActiveComponent implements OnInit {
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
    this.authService.getInfo().subscribe(res => { if (res['user'].activated) this.router.navigateByUrl(''); else this.authService.resendActive(this.authService.getId()).subscribe(); }, err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); });
    this.helperService.setPositionOnlyForm();
  }

  onSubmit(form: NgForm) {
    this.serverErrorMessages = null;
    this.authService.active(this.authService.getId(), form.value).subscribe(
      res => {
        alert(res['msg']);
        this.authService.getInfo().subscribe(res => this.router.navigateByUrl('user/' + res['user'].username), err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); });
      },
      err => this.serverErrorMessages = err.error.msg
    );
  }

  resendEmail() {
    this.serverErrorMessages = null;
    this.authService.resendActive(this.authService.getId()).subscribe(
      res => {
        alert(res['msg']);
        
        this.count = 60;
        this.counter$ = timer(0, 1000).pipe(take(this.count), map(() => --this.count));
      },
      err => this.serverErrorMessages = err.error.msg
    );
  }
}
