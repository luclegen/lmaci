import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  userDetails;
  title = '\'s Profile';
  
  constructor(private titleService: Title, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        this.titleService.setTitle(this.userDetails.firstName + this.title);
        this.userDetails.role = this.userDetails.role.split('')[0].toUpperCase() + this.userDetails.role.split('').slice(1).join('');
      },
      err => {}
    );
  }

}
