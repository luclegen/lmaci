import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  userDetails;
  title = '\'s Profile';
  
  constructor(private titleService: Title, route: ActivatedRoute, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.authService.getInfo().subscribe(
      res => {

      },

    );
    // this.userService.getProfile().subscribe(
    //   res => {
    //     this.userDetails = res['user'];
    //     this.titleService.setTitle(this.userDetails.firstName + this.title);
    //     this.userDetails.role = this.userDetails.role.split('')[0].toUpperCase() + this.userDetails.role.split('').slice(1).join('');
    //     this.userDetails.gender = this.userDetails.gender.split('')[0].toUpperCase() + this.userDetails.gender.split('').slice(1).join('');
    //   },
    //   err => {}
    // );
  }

}
