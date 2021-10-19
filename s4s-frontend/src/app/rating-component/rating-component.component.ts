import {Component, Input, OnInit} from '@angular/core';
import {Rating} from "../../model/rating";

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

  constructor() { }

  ngOnInit(): void {
  }

}
