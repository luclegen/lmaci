import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-find-username',
  templateUrl: './find-username.component.html',
  styleUrls: ['./find-username.component.sass']
})
export class FindUsernameComponent implements OnInit {

  emailFind: string;
  serverErrorMessages: string;

  emailRegex;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
  }

}
