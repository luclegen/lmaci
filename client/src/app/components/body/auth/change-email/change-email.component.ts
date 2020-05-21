import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

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

  constructor(private titleService: Title, private authService: AuthService, private router: Router) {
    this.titleService.setTitle('Change Email | Lmaci');
    this.emailRegex = this.authService.emailRegex;
  }

  ngOnInit(): void {
    this.authService.getInfo().subscribe(res => {
      if (res['user'].activated) this.router.navigateByUrl('');
    });
  }

  onSubmit(form: NgForm) {
    this.serverErrorMessages = null;
    this.authService.getInfo().subscribe(res => {
      if (!res['user'].activated) {
        this.authService.changeEmail(this.authService.getId(), form.value).subscribe(
          res => {
            alert(res['msg']);
            this.router.navigateByUrl('active');
          },
          err => {
            this.serverErrorMessages = err.error.message;
          }
        );
      }
    });
  }
}
