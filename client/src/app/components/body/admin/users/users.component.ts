import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit {

  users;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.adminService.getUsers().subscribe(
      res => {
        this.users = res['users'];
      },
      err => {
        alert(err.error.msg);
      }
    );
  }

  viewProfile(form: NgForm) {
    this.router.navigateByUrl('user/' + form.value.username);
  }

  makeAdmin(form: NgForm) {

  }
}
