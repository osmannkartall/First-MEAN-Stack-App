import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  postGitHubLink = '';

  constructor() { }

  ngOnInit() {
  }

  notifyGitHub() {
    console.log('Displayed the Profile.');
    this.postGitHubLink = 'https://github.com/osmannkartall';
  }

}
