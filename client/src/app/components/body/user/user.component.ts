import { Component, OnInit } from '@angular/core';
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
  
  constructor(private titleService: Title,
              private route: ActivatedRoute, 
              private authService: AuthService, 
              private userService: UserService, 
              private router: Router) { }

    ngOnInit(): void {
      const username = this.route.snapshot.paramMap.get('username');
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
              err => {
                alert(err.error.msg);
                this.router.navigateByUrl('');
              }
            );
          } else this.router.navigateByUrl('');
        }
      );
    }
  
}
