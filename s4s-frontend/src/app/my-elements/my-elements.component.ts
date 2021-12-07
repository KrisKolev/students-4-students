import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Sight, SightTopLocation} from "../../model/sight";
import {SightsService} from "../../service/http/backend/sights";
import {UserAuthService} from "../../service/userAuthService";
import {Rating} from "../../model/rating";
import {Label} from "../../model/label";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatTableDataSource} from "@angular/material/table";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {deleteObject, getStorage, ref} from "firebase/storage";
import {FirebaseService} from "../../service/http/external/firebase.service";
import {Router} from "@angular/router";

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
  mySightsDisplayedColumns: string[] = ['position', 'name', 'address', 'rating','ratingCalc','images', 'manage'];
  myRatingsdDisplayedColumns: string[] = ['position', 'comment', 'sightName','rating','images', 'manage'];

  sightsDataSource: any;
  ratingDataSource: any;

  mySights: Sight[];
  myRatings: Rating[];


  @ViewChild('sightsTable', { read: MatSort, static: true }) sightsTableSort: MatSort;
  @ViewChild('ratingsTable', { read: MatSort, static: true }) ratingsTableSort: MatSort;

  constructor(private sightService:SightsService,
              private authService:UserAuthService,
              private _liveAnnouncer: LiveAnnouncer,
              private _liveAnnouncerRating: LiveAnnouncer,
              public dialog: MatDialog,
              private firebaseService:FirebaseService,
              private _router: Router) {
  }

  ngOnInit(): void {
    var user = this.authService.getLoggedInUser();
    if(user == null){

      this._router.navigate([''])
      return;
    }

    this.sightsDataSource = new MatTableDataSource();
    this.ratingDataSource = new MatTableDataSource();

    this.sightService.getUserSights(this.authService.getLoggedInUser().uid).subscribe(res=>{
      this.mySights = [];
      // @ts-ignore
      const sights = res.data as Array;
      sights.forEach(sight => {
        const newSight = new SightTopLocation();
        newSight.InitSight(sight);
        newSight.onInitBase();

        this.firebaseService.getSightImageUrls(newSight);
        this.mySights.push(newSight);
    })
      this.sightsDataSource = new MatTableDataSource(this.mySights);
      this.sightsDataSource.sort = this.sightsTableSort;
    });

    this.sightService.getUserRatings(this.authService.getLoggedInUser().uid).subscribe(res=>{
      this.myRatings = [];
      // @ts-ignore
      var ratings = res.data as Array;
      ratings.forEach(rating=>{
        const newRating = new Rating();
        try {
          newRating.InitRating(rating);
          this.firebaseService.getRatingImageUrls(newRating)
          this.myRatings.push(newRating)
        } catch {
        }
      })

      this.ratingDataSource = new MatTableDataSource(this.myRatings);
      this.ratingDataSource.sort = this.ratingsTableSort;

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
          var sight = this.mySights.find(x=>x.uid===element);
          sight.ratingList.forEach(rat=> {
            const storage = getStorage();
            rat.imageNames.forEach(async name => {
              const delRef = ref(storage, 'images/rating/' + rat.uid + '/' + name);
              await deleteObject(delRef);
            })
          })
          this.ngOnInit();
        })
      }
    });

  }

  onDeleteRatingClick(element:any){
    const dialogRef = this.dialog.open(MyElementsDeleteConfirmDialog, {
      width: '250px',
      data: {message: "Do you really want to delete this rating?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "yes"){
        var rating = this.myRatings.find(x=>x.uid === element);
        var imageList=[];
        rating.imageNames.forEach(url=>{
          imageList.push(url)
        })

        this.sightService.deleteRating(element).subscribe(x=>{
          const storage = getStorage();
          imageList.forEach(async name=>{
            const delRef = ref(storage, 'images/rating/'+rating.uid+'/'+name);
            await deleteObject(delRef);
          })
          this.ngOnInit();
        })
      }
    });
  }


    onManageSight(uid: any) {
        this._router.navigate(["manageSight",uid]);
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
