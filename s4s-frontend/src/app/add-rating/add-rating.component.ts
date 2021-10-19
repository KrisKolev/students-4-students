import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.scss']
})
/**
 * Defines the modular rating component to add and change a rating.
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class AddRatingComponent implements OnInit {

  /**
   * Input for the expand panel title
   */
  @Input('panelTitle') panelTitle: string;
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
   *Fires when rating changes
   */
  @Output()  ratingUpdated = new EventEmitter();
  /**
   * Fires when comment changes
   */
  @Output() commentUpdated = new EventEmitter();
  /**
   * Fires when images update.
   */
  @Output() imagesUpdated = new EventEmitter();

  /**
   * Comment of the rating
   */
  comment: any;
  /**
   * Defines if the extension panel is open
   */
  panelOpenState = true;
  /**
   * Defines the stars array
   */
  ratingArr = [];

  /**
   * Initialites the component
   */
  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  /**
   * Fires when a star is clicked
   * @param rating
   */
  onClick(rating:number) {
    this.ratingUpdated.emit(rating);
    return false;
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

  /**
   * Fires when the comment changes
   */
  onCommentChange() {
    this.commentUpdated.emit(this.comment);
  }

  /**
   * Fires when the images change
   * @param files
   */
  onImagesUpdated(files: File[]) {
    this.imagesUpdated.emit(files)
  }
}
