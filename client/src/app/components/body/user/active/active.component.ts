import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import { Observable, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';

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

  constructor(private titleService: Title, private userService: UserService, private router: Router) {
    this.titleService.setTitle('Verify Email | Lmaci');
    this.codeRegex = this.userService.codeRegex;
    
    this.counter$ = timer(0,1000).pipe(
      take(this.count),
      map(() => --this.count)
    );
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe(
      res => {
        if (res['user'].activated) this.router.navigateByUrl('');
        else {
          this.userService.resendActive(this.userService.getId()).subscribe(
            res => {},
            err => {}
          );
        }
      },
      err => {}
    );
  }

  onSubmit(form: NgForm) {
    this.userService.active(this.userService.getId(), form.value).subscribe(
      res => {
        alert(res['msg']);
        this.router.navigateByUrl('user/profile');
      },
      err => {
        this.serverErrorMessages = err.error.msg;
      }
    );
  }

  resendEmail() {
    this.userService.resendActive(this.userService.getId()).subscribe(
      res => {
        alert(res['msg']);
        this.count = 60;
      },
      err => {
        this.serverErrorMessages = err.error.msg;
      }
    );
  }
}
