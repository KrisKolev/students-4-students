import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Sight, SightTopLocation} from "../../../../model/sight";

@Component({
    selector: 'app-sight-list-item',
    templateUrl: './sight-list-item.component.html',
    styleUrls: ['./sight-list-item.component.scss']
})
export class SightListItemComponent implements OnInit {

    @Input() sight: SightTopLocation;
    @Output() goToSightEventEmitter = new EventEmitter<any>();
    @Output() calcRouteEventEmitter = new EventEmitter<any>();

    ngOnInit(): void {
    }

    constructor() {
    }

    onGoToSight(sight: SightTopLocation): void {
        this.goToSightEventEmitter.emit(sight);
    }

    onCalcRoute(sight: SightTopLocation): void {
        this.calcRouteEventEmitter.emit(sight);
    }
}
