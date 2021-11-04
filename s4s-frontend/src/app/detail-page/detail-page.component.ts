import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";
import {Rating} from "../../model/rating";

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {

  title = "Sight Name";

  rating: any;

  images = [
    {title: 'First Location', short: 'First Locations Short', src:  "./assets/images/1.jpg" }
  ];

  constructor(config: NgbCarouselConfig) {
    config.interval = 8000;
    config.pauseOnHover = true;
  }

  onRatingUpdated($event:any){
    this.rating = $event;
  }

  ngOnInit(): void {
  }

}
