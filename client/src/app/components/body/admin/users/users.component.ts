import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit {

  users;

  req = {
    type: 'username',
    keyword: ''
  }

  constructor(private titleService: Title, private authService: AuthService, private adminService: AdminService, private router: Router) {
    this.titleService.setTitle('Users Management | Lmaci');
  }

  ngOnInit(): void {
    this.authService.getInfo().subscribe(
      res => {
        if (res['user'].role == 'root' || res['user'].role === 'admin') {
          this.adminService.getUsers().subscribe(
            res => {
              this.users = res['users'];
            },
            err => {
              alert(err.error.msg);
            }
          );
        } else this.router.navigateByUrl('');
      },
      err => {
        if (err.status == 440) {
          if (confirm('Your session has expired and must log in again.\nDo you want to login again?')) window.open('/login');
          else this.authService.removeToken();
        } else this.authService.removeToken();
      }
    );
  }

  viewProfile(username: string) {
    this.authService.getInfo().subscribe(
      res => {
        if (res['user'].role == 'root' || res['user'].role === 'admin') this.router.navigateByUrl('/' + username);
        else this.router.navigateByUrl('');
      },
      err => {
        if (err.status == 440) {
          if (confirm('Your session has expired and must log in again.\nDo you want to login again?')) window.open('/login');
          else this.authService.removeToken();
        } else this.authService.removeToken();
      }
    );
  }

  makeAdmin(username: string) {
    this.authService.getInfo().subscribe(res => {
      if (res['user'].role == 'root' || res['user'].role === 'admin') {
        if (confirm('Are you sure to make admin: ' + username + '?')) {
          this.adminService.makeAdmin(username).subscribe(
            res => {
              alert(res['msg']);
              this.ngOnInit();
            },
            err => {
              alert(err.error.msg);
            }
          );
        }
      }
      else this.router.navigateByUrl('');
    });
  }

  onSubmit(form: NgForm) {
    if (form.value.keyword.length > 0) {
      this.authService.getInfo().subscribe(res => {
        if (res['user'].role == 'root' || res['user'].role === 'admin') {
          this.adminService.searchUsers(form.value).subscribe(res => {
            this.users = res['users'];
          });
        } else this.router.navigateByUrl('');
      });
    }
  }

  showAll() {
    this.ngOnInit();
  }
}
