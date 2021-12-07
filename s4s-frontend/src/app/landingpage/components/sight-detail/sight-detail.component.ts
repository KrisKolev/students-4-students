import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SightTopLocation} from "../../../../model/sight";
import {UserAuthService} from "../../../../service/userAuthService";
import {MatDialog} from "@angular/material/dialog";
import {ManageRatingComponent} from "../../../manage-rating/manage-rating.component";
import {Router} from "@angular/router";
import {DetailPageComponent} from "../../../detail-page/detail-page.component";
import {privateDecrypt} from "crypto";
import {DetailPageService} from "../../../../service/http/backend/detail-page.service";
import {Rating} from "../../../../model/rating";

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

    @Output() closeDialogEvent = new EventEmitter();

    ngOnInit(): void {

    }

    constructor(private userAuthService: UserAuthService,
                private addCommentDialog: MatDialog,
                private detailDialog: MatDialog,
                private router: Router,
                private detailService: DetailPageService) {

    }

    public onInitDetails() {
        try {
            this.currentUserUid = this.userAuthService.getLoggedInUser().uid;
        } catch (e) {
        }
    }

    onGoToSight(sight: SightTopLocation): void {
        this.goToSightEventEmitter.emit(sight);
    }

    onCalcRoute(sight: SightTopLocation): void {
        this.calcRouteEventEmitter.emit(sight);
    }


    onExpand(uid:string, name:string, ratingList:Rating[]): void {
       const dialogRef = this.detailDialog.open(DetailPageComponent,
           {data:{uid:uid, name:name, ratingList:ratingList}});
    }

    onClose() {
        this.closeEvent.emit();
    }

    onEdit(sight: SightTopLocation) {
        this.router.navigate(['./myelements']).then(res=>{
            if(res){
                this.router.navigate(["manageSight",sight.uid]);
            }
        })
    }

    onAddComment(sight: SightTopLocation) {
        this.addCommentDialog.open(ManageRatingComponent,{
            data: {
                sightId: sight.uid,
            }
        }).afterClosed().subscribe(()=>{
            this.closeDialogEvent.emit();
            this.onClose();
        });
    }
}
