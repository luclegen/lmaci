import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.sass']
})
export class AdminsComponent implements OnInit {

  root;
  admins;

  req = {
    type: 'username',
    keyword: ''
  }

  constructor(private titleService: Title, private authService: AuthService, private adminService: AdminService, private router: Router) {
    this.titleService.setTitle('Admins Management | Lmaci');
  }

  ngOnInit(): void {
    this.authService.getInfo().subscribe(
      res => {
        if (res['user'].role == 'root' || res['user'].role === 'admin') {
          this.adminService.getAdmins().subscribe(
            res => {
              this.root = res['root'][0];
              this.admins = res['admins'];
            },
            err => alert(err.error.msg)
          );
        }
      },
      err => { if (err.status == 440 && confirm('Login again?\nYour session has expired and must log in again.')) window.open('/login'); }
    );
  }

  viewProfile(event: any, username: string) {
    this.authService.getInfo().subscribe(res => { if (res['user'].role == 'root' || res['user'].role === 'admin') if (event.ctrlKey) window.open('user/' + username); else this.router.navigateByUrl('user/' + username); }, err => { if (err.status == 440 && confirm('Login again?\nYour session has expired and must log in again.')) window.open('/login'); });
  }

  removeAsAdmin(username: string) {
    this.authService.getInfo().subscribe(
      res => {
        let adminUsername = res['user'].username;
        if (res['user'].role == 'root' || res['user'].role === 'admin') {
          if (confirm('Are you sure to remove as admin: ' + username + '?')) {
            this.adminService.removeAsAdmin(username).subscribe(
              res => {
                alert(res['msg']);
                this.ngOnInit();
                if (adminUsername == username) this.router.navigateByUrl('');
              },
              err => alert(err.error.msg)
            );
          }
        }
      },
      err => { if (err.status == 440 && confirm('Login again?\nYour session has expired and must log in again.')) window.open('/login'); }
    );
  }

  onSubmit(form: NgForm) {
    if (form.value.keyword.length > 0) {
      this.authService.getInfo().subscribe(
        res => {
          if (res['user'].role == 'root' || res['user'].role === 'admin') {
            this.adminService.searchAdmins(form.value).subscribe(res => {
              this.root = null;
              this.admins = res['admins'];
            });
          }
        },
        err => { if (err.status == 440 && confirm('Your session has expired and must log in again.\n\nDo you want to login again?')) window.open('/login'); }
      );
    }
  }

  showAll() {
    this.ngOnInit();
  }

}
