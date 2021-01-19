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
  admins = [];

  req = {
    type: 'username',
    keyword: ''
  }

  constructor(private titleService: Title, private authService: AuthService, private adminService: AdminService, private router: Router) {
    this.titleService.setTitle('Admins Management | Lmaci');
  }

  ngOnInit(): void {
    this.adminService.getAdmins().subscribe(res => { this.root = res['root']; this.admins = res['admins']; } , err => alert(err.error.msg));
  }

  viewProfile(event: any, username: string) {
    if (event.ctrlKey) window.open('user/' + username); else this.router.navigateByUrl('user/' + username);
  }

  removeAsAdmin(username: string) {
    if (confirm('Are you sure to remove as admin: ' + username + '?')) {
      this.adminService.removeAsAdmin(username).subscribe(
        res => {
          alert(res['msg']);
          this.ngOnInit();
          this.authService.setToken(res['token']);
          if (this.authService.getUsername() == username) this.router.navigateByUrl('');
        },
        err => alert(err.error.msg)
      );
    }
  }

  onSubmit(form: NgForm) {
    if (form.value.keyword.length > 0) this.adminService.searchAdmins(form.value).subscribe(res => { this.root = null; this.admins = res['admins']; });
  }

  showAll() {
    this.ngOnInit();
  }

}
