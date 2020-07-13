import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Observable, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private titleService: Title, private authService: AuthService, private router: Router) {
    this.titleService.setTitle('Verify Email | Lmaci');
    this.codeRegex = this.authService.codeRegex;
    
    this.counter$ = timer(0,1000).pipe(
      take(this.count),
      map(() => --this.count)
    );
  }

  ngOnInit(): void {
    this.authService.getInfo().subscribe(
      res => {
        if (res['user'].activated) this.router.navigateByUrl('');
        else {
          this.authService.resendActive(this.authService.getId()).subscribe();
        }
      }
    );
  }

  onSubmit(form: NgForm) {
    this.serverErrorMessages = null;
    this.authService.active(this.authService.getId(), form.value).subscribe(
      res => {
        alert(res['msg']);
        this.authService.getInfo().subscribe(
          res => {
            this.router.navigateByUrl('/' + res['user'].username);
          }
        );
      },
      err => {
        this.serverErrorMessages = err.error.msg;
      }
    );
  }

  resendEmail() {
    this.serverErrorMessages = null;
    this.authService.resendActive(this.authService.getId()).subscribe(
      res => {
        alert(res['msg']);
        
        this.count = 60;
        this.counter$ = timer(0, 1000).pipe(
          take(this.count),
          map(() => --this.count)
        );
      },
      err => {
        this.serverErrorMessages = err.error.msg;
      }
    );
  }
}
