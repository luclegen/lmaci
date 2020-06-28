import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'client';

  ngOnInit(): void {
    const vpWidth = document.documentElement.clientWidth;
    const thead = document.getElementsByTagName('thead') as HTMLCollectionOf<HTMLTableSectionElement>;
    const tbody = document.getElementsByTagName('tbody') as HTMLCollectionOf<HTMLTableSectionElement>;
    
    for (let i = 0; i < thead.length; i++) thead[i].style.fontSize = vpWidth * 0.015 + 'px';
    for (let i = 0; i < tbody.length; i++) tbody[i].style.fontSize = vpWidth * 0.0125 + 'px';
  }

}
