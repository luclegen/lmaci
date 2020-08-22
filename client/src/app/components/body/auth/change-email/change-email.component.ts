import { Component, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.authService.getInfo().subscribe(res => { if (res['user'].activated) this.router.navigateByUrl(''); }, err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); });
  }

  onSubmit(form: NgForm) {
    this.serverErrorMessages = null;
    this.authService.getInfo().subscribe(
      res => {
        if (!res['user'].activated) {
          this.authService.changeEmail(this.authService.getId(), form.value).subscribe(
            res => {
              alert(res['msg']);
              this.router.navigateByUrl('active');
            },
            err => this.serverErrorMessages = err.error.message
          );
        }
      },
      err => {
        if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login');
      }
    );
  }
}
