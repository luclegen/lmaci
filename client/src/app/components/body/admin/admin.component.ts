import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';

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

  constructor(private authService: AuthService, private router: Router, public helperService: HelperService) { }

  ngOnInit(): void {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const section = document.querySelector('section') as HTMLElement;

    section.style.fontSize = vw * 0.01625 + 'px';
    section.style.minHeight = vh - 60 + 'px';

    this.authService.getInfo().subscribe(res => { if (!res['user'].activated || res['user'].role == 'user') this.router.navigateByUrl(''); }, err => { if (err.status == 440 && confirm('Login again?\nYour session has expired and must log in again.')) window.open('/login'); });
  }

}
