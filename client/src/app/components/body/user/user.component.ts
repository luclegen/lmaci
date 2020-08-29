import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.sass']
})
export class UserComponent implements OnInit {
  userDetails;
  title = '\'s Profile';

  @HostListener('window:resize')
  onResize() {
    this.ngOnInit();
  }
  
  constructor(private titleService: Title,
              private route: ActivatedRoute, 
              private authService: AuthService, 
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    const vpWidth = document.documentElement.clientWidth;
    const thead = document.getElementsByTagName('thead') as HTMLCollectionOf<HTMLTableSectionElement>;
    const tbody = document.getElementsByTagName('tbody') as HTMLCollectionOf<HTMLTableSectionElement>;
  
    for (let i = 0; i < thead.length; i++) thead[i].style.fontSize = vpWidth * 0.03125 + 'px';
    for (let i = 0; i < tbody.length; i++) tbody[i].style.fontSize = vpWidth * 0.025 + 'px';
    
    this.authService.getInfo().subscribe(
      res => {
        if(res['user'].role === 'root' || res['user'].role === 'admin' || res['user'].username === username) {
          this.userService.getUser(username).subscribe(
            res => {
              this.userDetails = res['user'];
              this.titleService.setTitle(this.userDetails.name.first + this.title);
              this.userDetails.role = this.userDetails.role.split('')[0].toUpperCase() + this.userDetails.role.split('').slice(1).join('');
              this.userDetails.gender = this.userDetails.gender.split('')[0].toUpperCase() + this.userDetails.gender.split('').slice(1).join('');
            },
            err => alert(err.error.msg)
          );
        }
      },
      err => this.router.navigateByUrl('')
    );
  }
  
}
