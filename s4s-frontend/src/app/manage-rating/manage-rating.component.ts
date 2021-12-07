import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UploadItem} from "../../model/uploadItem";
import {Rating} from "../../model/rating";
import {SightsService} from "../../service/http/backend/sights";
import {UserAuthService} from "../../service/userAuthService";
import {FirebaseService} from "../../service/http/external/firebase.service";

@Component({
  selector: 'app-manage-rating',
  templateUrl: './manage-rating.component.html',
  styleUrls: ['./manage-rating.component.scss']
})
export class ManageRatingComponent implements OnInit {


    rating: any;
    ratingComment: string;
    ratingImages: File[];
    ratingId:string;
    sightId:string;
  addRatingInProgress: boolean;
  isNewRating: boolean

  constructor(private dialogRef: MatDialogRef<ManageRatingComponent>,
              @Inject(MAT_DIALOG_DATA) private ratingData: any,
              private sightService:SightsService,
              private authService:UserAuthService,
              private fireBaseService:FirebaseService) {

    if(ratingData.ratingId===undefined ||ratingData.ratingId ===""){
      this.isNewRating = true;
    }
    this.sightId = ratingData.sightId;
  }

  ngOnInit(): void {
  }

  onRatingUpdated($event: any) {
    this.rating = $event;
  }

  onCommentUpdated($event: any) {
    this.ratingComment = $event;
  }

  /**
   * Fires when the rating images are updated
   * @param files
   */
  onImagesUpdated(files: File[]) {
    this.ratingImages = files;
  }

  /**
   * Closes the dialog.
   * Component written by Michael Fahrafellner
   * creation date: 07.12.2021
   * last change done by: Michael Fahrafellner
   */
  onAbort() {
    this.dialogRef.close();
  }

  /**
   * Saves a rating
   * Component written by Michael Fahrafellner
   * creation date: 07.12.2021
   * last change done by: Michael Fahrafellner
   */
  async onSave() {
    if(this.rating === undefined)
      return;
    this.addRatingInProgress = true;

    if(this.isNewRating){

      try {
        const newRating = new Rating();

        newRating.rating = this.rating;
        newRating.comment = this.ratingComment;
        if(!this.ratingImages===undefined && this.ratingImages.length>0){
          let i:number;
          for(i = 0;i<this.ratingImages.length;i++) {
            newRating.imageNames.push('img_'+i)
          }
        }

        this.sightService.addRating(newRating,this.authService.getLoggedInUser().uid,this.sightId).subscribe(async res=>{

          if(!this.ratingImages===undefined && this.ratingImages.length>0){
            let y:number;
            for(y = 0;y<newRating.imageNames.length;y++) {
              const uploadItem = new UploadItem();
              // @ts-ignore
              uploadItem.filePath = 'images/rating/'+res.data.ratingList[0].uid+'/'+newRating.imageNames[i];
              uploadItem.file = this.ratingImages[y];
              await this.fireBaseService.uploadFileToFirestore(uploadItem);
            }
          }
          this.addRatingInProgress = false;
          this.dialogRef.close();
        })
      }
      catch (e) {
        this.addRatingInProgress = false;
      }
    }

  }

}
