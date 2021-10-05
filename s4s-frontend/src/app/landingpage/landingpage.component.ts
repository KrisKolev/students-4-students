import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {
  title = 'Locations';

  images = [
    {title: 'First Location', short: 'First Locations Short', src:  "./assets/images/1.jpg" },
    {title: 'Second Location', short: 'Second Locations Short', src: "./assets/images/2.jpg"},
    {title: 'Third Location', short: 'Third Locations Short', src: "./assets/images/3.jpg"}
  ];

  constructor(config: NgbCarouselConfig) {
    config.interval = 2000;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {
  }

}
