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
              this.root.gender = this.root.gender.split('')[0].toUpperCase() + this.root.gender.split('').slice(1).join('');
              this.admins.forEach(a => {
                a.gender = a.gender.split('')[0].toUpperCase() + a.gender.split('').slice(1).join('');
              });
            },
            err => {
              alert(err.error.msg);
            }
          );
        }
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

  viewProfile(username: string) {
    this.authService.getInfo().subscribe(res => {
      if (res['user'].role == 'root' || res['user'].role === 'admin') this.router.navigateByUrl('/' + username);
      else this.router.navigateByUrl('');
    });
  }

  removeAsAdmin(username: string) {
    this.authService.getInfo().subscribe(res => {
      let adminUsername = res['user'].username;
      if (res['user'].role == 'root' || res['user'].role === 'admin') {
        if (confirm('Are you sure to remove as admin: ' + username + '?')) {
          this.adminService.removeAsAdmin(username).subscribe(
            res => {
              alert(res['msg']);
              this.ngOnInit();
              if (adminUsername == username) this.router.navigateByUrl('');
            },
            err => {
              alert(err.error.msg);
            }
          );
        }
      } else this.router.navigateByUrl('');
    });
  }

  onSubmit(form: NgForm) {
    if (form.value.keyword.length > 0) {
      this.authService.getInfo().subscribe(res => {
        if (res['user'].role == 'root' || res['user'].role === 'admin') {
          this.adminService.searchAdmins(form.value).subscribe(res => {
            this.root = null;
            this.admins = res['admins'];
          });
        } else this.router.navigateByUrl('');
      });
    }
  }

  showAll() {
    this.ngOnInit();
  }

}
