import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-add-rating',
  templateUrl: './add-rating.component.html',
  styleUrls: ['./add-rating.component.scss']
})
export class AddRatingComponent implements OnInit {

  panelOpenState = true;
  ratingArr = [];

  @Input('panelTitle') panelTitle: string;
  @Input('rating') rating: number;
  @Input('starCount') starCount: number;
  @Input('color')  color: string;
  @Output()  ratingUpdated = new EventEmitter();
  @Output() commentUpdated = new EventEmitter();

  constructor() {

  }

  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }


  initialRating:any;
  comment: any;

  onRatingChanged($event: any) {
    this.initialRating = $event;
  }

  onClick(rating:number) {
    console.log(rating)
    this.ratingUpdated.emit(rating);
    return false;
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  hasError() {
    return this.rating ==undefined
  }

  onCommentChange() {
    console.log(this.comment)
    this.commentUpdated.emit(this.comment);
  }
}

enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}
