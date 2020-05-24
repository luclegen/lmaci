import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminService } from 'src/app/services/admin.service';
@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.sass']
})
export class AdminsComponent implements OnInit {

  root;
  admins;

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit(): void {
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

  viewProfile(username: string) {
    this.router.navigateByUrl('user/' + username);
  }

  removeAsAdmin(username: string) {
    if (confirm('Are you sure to remove as admin: ' + username + '?')) {
      this.adminService.removeAsAdmin(username).subscribe(
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

}
