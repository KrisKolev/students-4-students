import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
/**
 * Reusable component to display a star rating element
 * Component written by Michael Fahrafellner
 * creation date: 19.10.2021
 * last change done by: Michael Fahrafellner
 */
export class StarRatingComponent implements OnInit {

  /**
   * Input for the rating value
   */
  @Input('rating') rating: number;
  /**
   * Input for the star color
   */
  @Input('starCount') starCount: number;
  /**
   * Input for the star color
   */
  @Input('color')  color: string;
  /**
   * Defines if the rating can be changed
   */
  @Input('clickable')  clickable: boolean;
  /**
   *Fires when rating changes
   */
  @Output()  ratingUpdated = new EventEmitter();

  /**
   * Defines the stars array
   */
  ratingArr = [0,1,2,3,4];

  constructor() {
    for (let index = 0; index < this.starCount; index++) {
    this.ratingArr.push(index);
  }}

  ngOnInit(): void
  {
  }

  /**
   * Fires when a star is clicked
   * @param rating
   */
  onClick(rating:number) {
    if(this.clickable){
      this.ratingUpdated.emit(rating);
      return false;
    }
  }

  /**
   * Fires when a star is clicked to create the rating visualization.
   * @param index
   */
  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  /**
   * Defines if the form has an error.
   */
  hasError() {
    return this.rating ==undefined
  }
}
