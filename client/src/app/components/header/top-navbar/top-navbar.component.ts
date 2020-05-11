import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.sass']
})
export class TopNavbarComponent implements OnInit {

  userDetails;

  constructor() { }

  ngOnInit(): void {
  }

  onLogout() {
    
  }

  expandA(id, master, nav, height) {
    let a_id = document.getElementById(id),
        master_style = document.getElementById(master).style,
        nav_style = document.getElementById(nav).style,
        a = document.getElementsByClassName('a') as HTMLCollectionOf<HTMLElement>,
        li = document.getElementsByClassName('li') as HTMLCollectionOf<HTMLElement>,
        sub_nav = document.getElementsByClassName('sub-nav') as HTMLCollectionOf<HTMLElement>;
    
    // Close all a tag
    if (a_id.getAttribute('aria-expanded') == 'false') {
      for (let i = 0; i < a.length; i++) {
        if (a[i].getAttribute('aria-expanded') == 'true') {
          li[i].style.backgroundColor = 'lime';
          sub_nav[i].style.height = '0';
          a[i].setAttribute('aria-expanded', 'false');
        }
      }
      nav_style.height = height;
      master_style.backgroundColor = 'green';
      a_id.setAttribute('aria-expanded', 'true');
    } else {
      nav_style.height = '0';
      master_style.backgroundColor = 'lime';
      a_id.setAttribute('aria-expanded', 'false');
    }
  }
}
