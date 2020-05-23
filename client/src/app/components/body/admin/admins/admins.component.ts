import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.sass']
})
export class AdminsComponent implements OnInit {

  root;
  admins;

  idSelected;

  constructor(private adminService: AdminService) { }

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

  removeAsAdmin(form: NgForm) {
    alert(JSON.stringify(form.value));
  }

}
