import {Component, Input, OnInit} from '@angular/core';
import {Rating} from "../../model/rating";
import {raf} from "@ionic/angular/util/util";

@Component({
  selector: 'app-rating-component',
  templateUrl: './rating-component.component.html',
  styleUrls: ['./rating-component.component.scss']
})
/**
 * Reusable component to display a single rating element
 * Component written by Michael Fahrafellner
 * creation date: 19.10.2021
 * last change done by: Michael Fahrafellner
 */
export class RatingComponentComponent implements OnInit {

  /**
   * Defines if the rating can be changed
   */
  @Input('rating')  rating: Rating;

  currentIndex: any = -1;
  showFlag: any = false;
  imageObject: Array<object>
  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(){

  }

  showLightbox(index) {
    this.imageObject = Array<object>();
    this.rating.imageUrl.forEach(url=>{
      this.imageObject.push({
        image:url,
        thumbImage:url
      })
    })
    var indexNumber = this.rating.imageUrl.findIndex(x=>x == index)
    this.currentIndex = indexNumber;
    this.showFlag = true;
  }

  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }

}
