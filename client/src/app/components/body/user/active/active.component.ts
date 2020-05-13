import { Component, OnInit } from '@angular/core';

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

}
