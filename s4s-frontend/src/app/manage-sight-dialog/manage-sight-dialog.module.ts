import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSightDialogComponent } from './manage-sight-dialog.component';
import { ManageSightDialogRoutingModule } from './manage-sight-dialog-routing.module';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {GoogleMapsModule} from "@angular/google-maps";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AddRatingComponent} from "../add-rating/add-rating.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {ImageUploadComponent} from "../image-upload/image-upload.component";
import {FileUploadModule} from "ng2-file-upload";
import {MatSelectModule} from "@angular/material/select";
import {MatChipsModule} from "@angular/material/chips";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {RatingComponentComponent} from "../rating-component/rating-component.component";
import {StarRatingComponent} from "../star-rating/star-rating.component";
import {NgxIonicImageViewerModule} from "ngx-ionic-image-viewer";
import {IonicModule} from "@ionic/angular";
import {NgImageFullscreenViewModule} from "ng-image-fullscreen-view";

@NgModule({
    declarations: [ManageSightDialogComponent,AddRatingComponent,ImageUploadComponent,RatingComponentComponent,StarRatingComponent],
    imports: [
        CommonModule,
        ManageSightDialogRoutingModule,
        FlexLayoutModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatGridListModule,
        MatAutocompleteModule,
        GoogleMapsModule,
        MatButtonToggleModule,
        MatTooltipModule,
        MatExpansionModule,
        FormsModule,
        FileUploadModule,
        MatSelectModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        NgxIonicImageViewerModule,
        IonicModule,
        NgImageFullscreenViewModule
    ]
})
/**
 * Model for manage sight component.
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class ManageSightDialogModule { }
