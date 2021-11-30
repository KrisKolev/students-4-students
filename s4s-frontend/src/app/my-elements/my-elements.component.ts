import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Sight} from "../../model/sight";
import {SightsService} from "../../service/http/backend/sights";
import {UserAuthService} from "../../service/userAuthService";
import {Rating} from "../../model/rating";
import {Label} from "../../model/label";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-my-elements',
  templateUrl: './my-elements.component.html',
  styleUrls: ['./my-elements.component.scss']
})
export class MyElementsComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;

  /**
   * Columes of the my sights table
   * */
  mySightsDisplayedColumns: string[] = ['position', 'name', 'address', 'rating', 'manage'];
  myRatingsdDisplayedColumns: string[] = ['position', 'name', 'address', 'rating', 'manage'];
  dataSource: any;
  dataSourceRating: any;
  mySights: Sight[];
  myRatings: Rating[];

  constructor(private sightService:SightsService,
              private authService:UserAuthService,
              private _liveAnnouncer: LiveAnnouncer,
              private _liveAnnouncerRating: LiveAnnouncer,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.sightService.getUserSights(this.authService.getLoggedInUser().uid).subscribe(res=>{
      this.mySights = [];
      // @ts-ignore
      const sights = res.data as Array;
      sights.forEach(sight => {
        const newSight = new Sight();
        newSight.uid = sight.uid;
        newSight.name = sight.name;
        newSight.longitude = sight.longitude;
        newSight.latitude = sight.latitude;
        newSight.address = sight.address;

        sight.ratingList.forEach(rating => {
          const newRating = new Rating();
          try {
            newRating.uid = rating.uid;
            newRating.rating = rating.rating;
            newRating.comment = rating.comment;
            var images = [];
            rating.imageNames.forEach(rat => {
              images.push(rat)
            })
            newRating.imageNames = images;
          } catch {
          }
          newSight.ratingList.push(newRating);
        })

        sight.labelList.forEach(label => {
          const newLabel = new Label();
          try {
            newLabel.uid = label.uid;
            newLabel.name = label.name;
            newLabel.color = label.color;
          } catch {
          }
          newSight.labelList.push(newLabel)
        })

        this.mySights.push(newSight);
    })

      this.dataSource = new MatTableDataSource(this.mySights);
      this.dataSource.sort = this.sort;
    });

    this.sightService.getUserRatings(this.authService.getLoggedInUser().uid).subscribe(res=>{
      this.myRatings = [];
      // @ts-ignore
      var ratings = res.data as Array;
      ratings.forEach(rating=>{
        const newRating = new Rating();
        try {
          newRating.uid = rating.uid;
          newRating.rating = rating.rating;
          newRating.comment = rating.comment;
          var images = [];
          rating.imageNames.forEach(rat => {
            images.push(rat)
          })
          newRating.imageNames = images;
          this.myRatings.push(newRating)
        } catch {
        }
      })
    })
  }

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  /** Announce the change in sort state for assistive technology. */
  announceSortChangeRating(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncerRating.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncerRating.announce('Sorting cleared');
    }
  }

  onDeleteClick(element:any) {
    const dialogRef = this.dialog.open(MyElementsDeleteConfirmDialog, {
      width: '250px',
      data: {message: "Do you really want to delete this Sight?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "yes"){
        this.sightService.deleteSight(element).subscribe(x=>{
          var res = x;
          this.ngOnInit();
        })
      }
    });

  }



}

@Component({
  selector: 'my-elements-delete-confirm-dialog',
  templateUrl: 'my-elements-delete-confirm-dialog.html',
  styleUrls: ['./my-elements.component.scss']
})
export class MyElementsDeleteConfirmDialog {

  constructor(
      public dialogRef: MatDialogRef<MyElementsDeleteConfirmDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  message: string;
}
