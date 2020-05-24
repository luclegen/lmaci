import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit {

  users;

  constructor() { }

  ngOnInit(): void {
  }

  viewProfile(form: NgForm) {

  }

  makeAdmin(form: NgForm) {

  }
}
