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

  users = [];

  req = {
    type: 'username',
    keyword: ''
  }

  constructor(private titleService: Title, private authService: AuthService, private adminService: AdminService, private router: Router) {
    this.titleService.setTitle('Users Management | Lmaci');
  }

  ngOnInit(): void {
    this.adminService.getUsers().subscribe(res => this.users = res['users'], err => alert(err.error.msg));
  }

  viewProfile(event: any, username: string) {
    if (event.ctrlKey) window.open('user/' + username); else this.router.navigateByUrl('user/' + username);
  }

  makeAdmin(username: string) {
    if (confirm('Are you sure to make admin: ' + username + '?')) this.adminService.makeAdmin(username).subscribe(res => { alert(res['msg']); this.ngOnInit(); }, err => alert(err.error.msg));
  }

  onSubmit(form: NgForm) {
    if (form.value.keyword.length > 0) this.adminService.searchUsers(form.value).subscribe(res => this.users = res['users']);
  }

  showAll() {
    this.ngOnInit();
  }

}
