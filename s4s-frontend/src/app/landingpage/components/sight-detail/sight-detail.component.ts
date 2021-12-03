import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SightTopLocation} from "../../../../model/sight";
import {UserAuthService} from "../../../../service/userAuthService";

@Component({
    selector: 'app-sight-detail',
    templateUrl: './sight-detail.component.html',
    styleUrls: ['./sight-detail.component.scss']
})
export class SightDetailComponent implements OnInit {

    currentUserUid: string;
    @Input() sight: SightTopLocation = new SightTopLocation();
    @Input() isDetailView: boolean;
    @Output() calcRouteEventEmitter = new EventEmitter<any>();
    @Output() goToSightEventEmitter = new EventEmitter<any>();
    @Output() closeEvent = new EventEmitter();

    ngOnInit(): void {
        //TODO init currentUserId
    }

    constructor(private userAuthService: UserAuthService) {
    }

    onGoToSight(sight: SightTopLocation): void {
        this.goToSightEventEmitter.emit(sight);
    }

    onCalcRoute(sight: SightTopLocation): void {
        this.calcRouteEventEmitter.emit(sight);
    }

    onClose() {
        this.closeEvent.emit();
    }

    onEdit(sight: SightTopLocation) {
        console.log('onEdit');
    }
}
