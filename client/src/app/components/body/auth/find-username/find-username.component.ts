import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-username',
  templateUrl: './find-username.component.html',
  styleUrls: ['./find-username.component.sass']
})
export class FindUsernameComponent implements OnInit {

  emailFind: string;
  serverErrorMessages: string;

  emailRegex;

  constructor(private titleService: Title, private authService: AuthService, private router: Router) {
    this.titleService.setTitle('Find Username | Lmaci');
    this.emailRegex = this.authService.emailRegex;
  }
  ngOnInit(): void {
    if (this.authService.getToken()) this.router.navigateByUrl('');
  }

  onSubmit(form: NgForm) {
    this.serverErrorMessages = null;
    this.authService.findUsername(form.value).subscribe(
      res => {
        alert(res['msg']);
        this.router.navigateByUrl('reset-password/' + res['username']);
      },
      err => {
        this.serverErrorMessages = err.error.msg;
      }
    );
  }

}
