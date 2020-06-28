import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const vpWith = document.documentElement.clientWidth;
    const section = document.querySelector('section');

    section.style.fontSize = vpWith * 0.01625 + 'px';
    
    this.authService.getInfo().subscribe(res => {
      if (res['user'].role == 'user') this.router.navigateByUrl('');
    });
  }

}
