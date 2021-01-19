import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {
  
  @HostListener('window:resize')
  onResize() {
    this.ngOnInit();
  }

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const section = document.querySelector('section') as HTMLElement;

    section.style.fontSize = vw * 0.01625 + 'px';
    section.style.minHeight = vh - 60 + 'px';
  }

}
