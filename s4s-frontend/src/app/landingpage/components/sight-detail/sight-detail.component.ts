import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Sight, SightTopLocation} from "../../../../model/sight";

@Component({
  selector: 'app-sight-detail',
  templateUrl: './sight-detail.component.html',
  styleUrls: ['./sight-detail.component.scss']
})
export class SightDetailComponent implements OnInit {

  sight: SightTopLocation = new SightTopLocation();
  @Output() calcRouteEventEmitter = new EventEmitter<any>();
  @Output() closeEvent = new EventEmitter();

  ngOnInit(): void {
  }

  constructor() {
  }

  onCalcRoute(sight: SightTopLocation): void {
    this.calcRouteEventEmitter.emit(sight);
  }

  onClose(){
    this.closeEvent.emit();
  }
}
