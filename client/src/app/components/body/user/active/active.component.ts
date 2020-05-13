import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.sass']
})
export class ActiveComponent implements OnInit {

  verificationCode: '';

  codeRegex;

  serverErrorMessages: string;

  constructor(private titleService: Title, private userService: UserService, private router: Router) {
    this.titleService.setTitle('Verify Email | Lmaci');
    this.codeRegex = this.userService.codeRegex;
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe(
      res => {
        if (res['user'].activated) this.router.navigateByUrl('');
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
  }
}
