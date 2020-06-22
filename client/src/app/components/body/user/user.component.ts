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
  }

}
