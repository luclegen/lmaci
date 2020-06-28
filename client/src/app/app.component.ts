import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'client';

  ngOnInit(): void {
    const vpWith = document.documentElement.clientWidth;
    const thead = document.querySelector('thead');
    const tbody = document.querySelector('tbody');
    
    thead.style.fontSize = vpWith * 0.015 + 'px';
    tbody.style.fontSize = vpWith * 0.0125 + 'px';
  }

}
