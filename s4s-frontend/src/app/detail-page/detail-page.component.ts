import {Component, Inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import {DetailPageService} from "../../service/http/backend/detail-page.service";
import {Sight, SightTopLocation} from "../../model/sight";
import {HttpClient} from "@angular/common/http";
import {SightDetailComponent} from "../landingpage/components/sight-detail/sight-detail.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {

  //@Input("sight") sight: Sight;

  rating: any;

  sight: any;

  images = [
    {title: 'First Location', short: 'First Locations Short', src:  "./assets/images/1.jpg" }
  ];

  ngOnInit(): void {
    console.log(this.data.name);
    console.log(this.data.uid);
  }

  constructor(config: NgbCarouselConfig,
              public service: DetailPageService,
              @Inject(MAT_DIALOG_DATA)public data:any,
              public dialog:MatDialogRef<DetailPageComponent>) {


    config.interval = 8000;
    config.pauseOnHover = true;

    this.sight = service.getSightById().subscribe((res) => {
      this.sight = res;
    });
  }

  onRatingUpdated($event:any){
    this.rating = $event;
  }

  sightById(id:string):void{
    this.sight = this.service.getSight(id).subscribe((s)=>{this.sight = s});
  }
}
