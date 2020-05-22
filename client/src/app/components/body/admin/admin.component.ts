import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {

  userDetails;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getInfo().subscribe(res => {
      this.userDetails = res['user'];
    });
  }

}
