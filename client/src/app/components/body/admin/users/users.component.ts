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
    this.adminService.getUsers().subscribe( res => this.users = res['users'], err => alert(err.error.msg));
  }

  viewProfile(event: any, username: string) {
    this.authService.getInfo().subscribe(res => { if (res['user'].role == 'root' || res['user'].role === 'admin') if (event.ctrlKey) window.open('user/' + username); else this.router.navigateByUrl('user/' + username); }, err => { if (err.status == 440 && confirm('Login again?\nYour session has expired and must log in again.')) window.open('/login'); });
  }

  makeAdmin(username: string) {
    this.authService.getInfo().subscribe(res => { if ((res['user'].role == 'root' || res['user'].role === 'admin') && confirm('Are you sure to make admin: ' + username + '?')) this.adminService.makeAdmin(username).subscribe(res => { alert(res['msg']); this.ngOnInit(); }, err => alert(err.error.msg)); }, err => { if (err.status == 440 && confirm('Login again?\nYour session has expired and must log in again.')) window.open('/login'); });
  }

  onSubmit(form: NgForm) {
    if (form.value.keyword.length > 0) this.authService.getInfo().subscribe(res => { if (res['user'].role == 'root' || res['user'].role === 'admin') this.adminService.searchUsers(form.value).subscribe(res => this.users = res['users']); }, err => { if (err.status == 440 && confirm('Login again?\nYour session has expired and must log in again.')) window.open('/login'); });
  }

  showAll() {
    this.ngOnInit();
  }

}
