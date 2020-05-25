import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { AdminService } from 'src/app/services/admin.service';
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


  constructor(private authService: AuthService, private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    let admins_span = document.getElementById('admins-span'),
        admins_select = document.getElementById('admins-select'),
        admins_search = document.getElementById('admins-search'),
        admins_submit = document.getElementById('admins-submit');

    // admins_search.style.width = admins_span.style.width - admins_select.style.width - admins_submit.style.width;

    this.authService.getInfo().subscribe(res => {
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
    });
  }

  viewProfile(username: string) {
    this.authService.getInfo().subscribe(res => {
      if (res['user'].role == 'root' || res['user'].role === 'admin') this.router.navigateByUrl('user/' + username);
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
    
  }

}
