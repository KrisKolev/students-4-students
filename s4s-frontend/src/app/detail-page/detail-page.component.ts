import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import {DetailPageService} from "../../service/http/backend/detail-page.service";
import {Sight} from "../../model/sight";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {

  //@Input("sight") sight: Sight;

  title = "Sight Name";

  rating: any;

  sight: any;

  images = [
    {title: 'First Location', short: 'First Locations Short', src:  "./assets/images/1.jpg" }
  ];

  ngOnInit(): void {

  }

  constructor(config: NgbCarouselConfig, service: DetailPageService, private activatedRoute: ActivatedRoute) {
    config.interval = 8000;
    config.pauseOnHover = true;

    this.sight = service.getSightById().subscribe((res) => {
      this.sight = res;
    });
  }

  onRatingUpdated($event:any){
    this.rating = $event;
  }

}
