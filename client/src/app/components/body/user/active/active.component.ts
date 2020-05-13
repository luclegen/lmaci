import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.sass']
})
export class ActiveComponent implements OnInit {

  verificationCode: '';

  codeRegex;

  serverErrorMessages: string;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
  }

  resendEmail() {
  }
}
