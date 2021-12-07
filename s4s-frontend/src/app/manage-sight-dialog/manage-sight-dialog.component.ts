import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {LocationService} from "../../service/http/backend/locations";
import {GoogleMap} from "@angular/google-maps";
import {UserAuthService} from "../../service/userAuthService";
import {GeoLocationService} from "../../service/http/external/geoLocation.service";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {map, startWith} from 'rxjs/operators';
import {SightsService} from "../../service/http/backend/sights";
import {Label} from "../../model/label";
import {Sight} from "../../model/sight";
import {Rating} from "../../model/rating";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PopupType} from "../../model/popupType";
import {PopupComponent} from "../popup/popup.component";
import {FirebaseService} from "../../service/http/external/firebase.service";
import {UploadItem} from "../../model/uploadItem";
import {templateJitUrl} from "@angular/compiler";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-manage-sight-dialog',
  templateUrl: './manage-sight-dialog.component.html',
  styleUrls: ['./manage-sight-dialog.component.scss']
})
/**
 * Central component to create a new sight or manage an existing one.
 * Component written by Michael Fahrafellner
 * creation date: 16.10.2021
 * last change done by: Michael Fahrafellner
 */
export class ManageSightDialogComponent implements OnInit {

  /**
   * HTML element of all labels
   */
  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  /**
   * HTML element of the google maps object.
   */
  @ViewChild('googleMap', { static: false }) map: GoogleMap
  /**
   * HTML element of the address search bar.
   */
  @ViewChild('addressSearch') public searchElementRef: ElementRef;

  /**
   * Zoom value for the map object
   */
  zoom = 15
  /**
   * Center to be displayed on the map object.
   */
  center: google.maps.LatLngLiteral
  /**
   * Options for the google maps control
   */
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 1,
    zoom:15
  }
  /**
   * Current map markers for the google maps object.
   */
  mapMarkers = []
  /**
   * Defines all markers for existing sights
   */
  mapMarkersSights = []
  /**
   * Geocoder defined by the places API
   * @private
   */
  private geoCoder;

  /**
   * Sight form with all data.
   */
  addSightForm: FormGroup;
  /**
   * Name of the sight
   */
  nameValue: any;
  /**
   * Address of the sight
   */
  addressValue: string = "";
  /**
   * Value of the initial rating
   */
  rating: any;
  /**
   * Comment of the initial rating
   */
  ratingComment: any;
  /**
   * Labels of the sight
   */
  labels: Label[] = [];
  /**
   * Images of the rating
   */
  ratingImages: File[]=[];
  /**
   * Defines if the input form is valid
   */
  validForm: boolean;
  /**
   * Defines if the add sight process is running
   */
  addSightInProgress:boolean = false;
  /**
   * Longitude of the new sight
   */
  customLongitude:any;
  /**
   * Latitude of the new sight
   */
  customLatitude:any;

  /**
   * Defines if the labels are selectable in the chip component
   */
  selectable = true;
  /**
   * Defines if labels can be removed from the chip component
   */
  removable = true;
  /**
   * Defines separator codes
   */
  separatorKeysCodes: number[] = [ENTER, COMMA];
  /**
   * Defines the control for the label chip object
   */
  labelCtrl = new FormControl();
  /**
   * Labels to be displayed in the autocomplete control
   */
  filteredLabels: Observable<Label[]>;
  /**
   * All available labels.
   */
  allLabels: Label[] = [];
  /**
   * All available sights to be displayed.
   */
  allSights: Sight[] = [];

  /**
   * Defines if the detail window is hidden
   */
  detailWindowHidden: boolean = true;
  /**
   * sight to be shown in the detail view
   */
  detailedSight : Sight = new Sight();

  isInitialized: boolean = false;

  labelErrorVisible: boolean = false;

  labelMapErrorVisible: boolean = false;

  manageSightUidString: String;

  managedSight: Sight;

  /**
   * Constructor for the manage sight component
   * @param router
   * @param locService
   * @param authService
   * @param geolocService
   * @param ngZone
   * @param sightService
   * @param dialog
   * @param firebaseService
   */
  constructor(private router: Router,
              private locService: LocationService,
              private authService:UserAuthService,
              private geolocService:GeoLocationService,
              private ngZone: NgZone,
              private sightService:SightsService,
              private dialog: MatDialog,
              private firebaseService: FirebaseService,
              private _router: Router,
              private actRoute: ActivatedRoute) {

    this.isInitialized = false;

    //create form group
    this.addSightForm = new FormGroup({
      sightName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
      address: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
    });

    this.onLoadLabels();
    this.onLoadSights();

    this.addSightForm.valueChanges.subscribe( ()=>{
      if(!this.isInitialized)return;
      this.checkFormValidity();
    })

    this.labelCtrl.valueChanges.subscribe(()=>{
      if(!this.isInitialized)return;
      this.checkFormValidity();
    })
  }

  /**
   * Initializes the model
   */
  ngOnInit(): void {
    var user = this.authService.getLoggedInUser();
    if(user == null){

      this._router.navigate([''])
      return;
    }
    this.initMap();

    let sightId = this.actRoute.snapshot.params.id;
    if(sightId!="1"){
      this.manageSightUidString = sightId
    }
    else {
      this.manageSightUidString = "";
    }
  }

  /**
   * Initializes the map object.
   */
  initMap(){

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      const marker = new google.maps.Marker({
        position: {
          lat: this.center.lat,
          lng: this.center.lng,
        },
        map: this.map.googleMap,
        title: `Your position`,
        label: `P`,
        optimized: false
      });

      this.mapMarkers.push(marker)
      this.isInitialized = true;
    });
  }

  /**
   * Resets the map to the user location.
   */
  onGoToLocation() {
    this.initMap();
  }

  /**
   * Fired when the view is initialized. Sets the autocomplete object and initializes google places.
   */
  ngAfterViewInit() {
    this.geoCoder = new google.maps.Geocoder;
    try {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.placeCustomMarker(place.geometry.location.lat(),place.geometry.location.lng())
          this.zoom = 19;
          this.center = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }

        });
      });
    }
    catch (e) {
      console.log(e);
    }
  }

  /**
   * Validates if a form control has errors.
   * @param controlName
   * @param errorName
   */
  public hasError = (controlName: string, errorName: string) => {
    return this.addSightForm.controls[controlName].hasError(errorName);
  }

  /**
   * Loads all labels from the database.
   */
  onLoadLabels(){
    this.sightService.getLabels().subscribe((val)=>
    {
      const pulledLabels=[];
      // @ts-ignore
      const lab = val.data as Array;
      lab.forEach(ob=>{
        const newLabel = new Label();
        newLabel.name = ob.name;
        newLabel.uid = ob.uid;
        newLabel.color = ob.color;
        pulledLabels.push(newLabel)
      })
      this.allLabels = pulledLabels;
      //this.allLabelsObjects = pulledLabels;

      this.filteredLabels = this.labelCtrl.valueChanges.pipe(
          startWith(null),
          map((tag: String | null) => tag ? this._filterLabel(tag) : this.allLabels.slice()));
    });

  }

  /**
   * Loads all sights from the database.
   */
  onLoadSights(){
    this.sightService.getSights().subscribe((val)=>
    {
      const pulledSights=[];
      // @ts-ignore
      const sights = val.data as Array;
      sights.forEach(sight=>{
        const newSight = new Sight();
        newSight.InitSight(sight);
        pulledSights.push(newSight);
      })

      this.allSights = pulledSights;

      if(this.manageSightUidString!=""){
        this.managedSight = this.allSights.find(x=>x.uid===this.manageSightUidString);
        this.nameValue = this.managedSight.name;
        this.addressValue = this.managedSight.address;
        this.labels = this.managedSight.labelList
        this.placeCustomMarker(Number.parseFloat(this.managedSight.latitude),Number.parseFloat(this.managedSight.longitude))
        this.initMapWithPosition(Number.parseFloat(this.managedSight.latitude),Number.parseFloat(this.managedSight.longitude),16)
      }

      this.allSights.forEach((sight)=>{

        if(sight.uid === this.managedSight.uid){
          return;
        }
        const svgMarker = {
          path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
          fillColor: "blue",
          fillOpacity: 0.6,
          strokeWeight: 0,
          rotation: 0,
          scale: 2,
          anchor: new google.maps.Point(15, 30),
        };

        const existingMarker = new google.maps.Marker({
          position: {
            lat: Number.parseFloat(sight.latitude),
            lng: Number.parseFloat(sight.longitude),
          },
          title: sight.address,
          label: {
            text: sight.name,
            color: "blue",
            fontSize: "20px"
          },
          icon: svgMarker,
          optimized: false,

        })
        this.mapMarkersSights.push(existingMarker)
      })



    })
  }

  /**
   * Handles the map click event to place a custom marker
   * @param $event
   */
  onMapClick($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    console.log($event)
    this.placeCustomMarker($event.latLng.lat(),$event.latLng.lng())
    this.initMapWithPosition($event.latLng.lat(),$event.latLng.lng(),16)
  }

  /**
   * Places a custom marker on the given coordinates.
   * @param latitude
   * @param longitude
   */
  placeCustomMarker(latitude:number, longitude:number){
    if(this.mapMarkers.length>1){
      this.mapMarkers.splice(1,this.mapMarkers.length-1)
    }

    if(this.managedSight===undefined){
      const marker = new google.maps.Marker({
        position: {
          lat: latitude,
          lng: longitude,
        },
        title: `New sight`,
        label: `New sight`,
        optimized: false
      });
      this.customLatitude = latitude;
      this.customLongitude = longitude;
      this.getAddress(latitude, longitude);
      this.mapMarkers.push(marker);
    }
    else{
      const marker = new google.maps.Marker({
        position: {
          lat: latitude,
          lng: longitude,
        },
        title: this.nameValue,
        label: this.nameValue,
        optimized: false
      });
      this.customLatitude = latitude;
      this.customLongitude = longitude;
      this.getAddress(latitude, longitude);
      this.mapMarkers.push(marker);
    }
  }

  /**
   * Inits the map location with specific coordinates and map zoom.
   * @param latidute
   * @param longitude
   * @param zoom
   */
  initMapWithPosition(latidute:number, longitude:number,zoom:number){
    this.center = {
      lat: latidute,
      lng: longitude,
    }
    this.zoom = zoom;
  }

  /**
   * Opens the detailed window for sights.
   * @param marker
   */
  async openInfo(marker: google.maps.Marker) {
    this.detailWindowHidden = false;
    try {
      const test = this.allSights.find(x=>x.name==marker.getLabel().text && x.address == marker.getTitle())
      this.detailedSight = test as Sight;
      this.detailedSight.ratingList.forEach(async rat=>{
        await this.firebaseService.getRatingImageUrls(rat);
      })
    }
    catch (e)
    {
      this.detailWindowHidden = true;
    }
  }

  /**
   * Hides the detail window.
   */
  onCloseDetail(){
    this.detailWindowHidden = true;
  }

  /**
   * Calculates an address by longitude and latitude.
   * @param latitude
   * @param longitude
   */
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 16;
          this.addressValue = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  /**
   * Adds a label to the sight. Implements checks to ensure that only available labels are added. If a new tag is found it will be updated in firebase.
   * @param $event
   */
  addLabel($event: MatChipInputEvent): void {
    const value = ($event.value || '').trim();

    const label = new Label();
    label.name = value;

    const findLabel = this.labels.find(x=>x.name == label.name)
    const findLabelAll = this.allLabels.find(x=>x.name == label.name);

    //add to both
    if(findLabelAll == undefined && findLabel == undefined){
      this.allLabels.push(label);
      this.labels.push(label);
    }

    //add to labels
    if(findLabelAll != undefined && findLabel == undefined){
      this.labels.push(label);
    }

    //do nothing
    if(findLabelAll !=undefined && findLabel != undefined){
    }

    // Clear the input value
    // @ts-ignore
    $event.chipInput!.clear();
    this.labelCtrl.setValue(null);
  }

  /**
   *Removes a tag from the managed sight.
   * @param label
   * label to be removed
   */
  removeLabel(label: Label): void {
    const index = this.labels.indexOf(label);
    if (index >= 0) {
      this.labels.splice(index, 1);
    }
  }

  /**
   * Fires when a label is selected in the UI from the autocomplete field.
   * @param event
   */
  onLabelSelected(event: MatAutocompleteSelectedEvent): void {
    const searchLabel = this.allLabels.find(x=>x.name == event.option.viewValue);
    if(searchLabel==undefined)return;

    const searchInLabels = this.labels.find(x=>x.name == searchLabel.name)
    if(searchInLabels != undefined)return;

    this.labels.push(searchLabel);
    this.labelInput.nativeElement.value = '';
    this.labelCtrl.setValue(null);
    this.filteredLabels = null;
    this.filteredLabels = this.labelCtrl.valueChanges.pipe(
        startWith(null),
        map((tag: String | null) => tag ? this._filterLabel(tag) : this.allLabels.slice()));
  }

  /**
   * Returns a filtered list of labels matching the value
   * @param value
   * @private
   */
  private _filterLabel(value: String): Label[] {
    const filterValue = value.toLowerCase();
    return this.allLabels.filter(label => label.name.toLowerCase().includes(filterValue));
  }

  /**
   * Fires when the rating value is updated.
   * @param $event
   */
  onRatingUpdated($event:any){
    this.rating = $event;
    //this.checkFormValidity();
  }

  /**
   * Fires when the rating comment is changed
   * @param $event
   */
  onCommentUpdated($event:any) {
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
   * Checks if the input form is valid
   */
  checkFormValidity(){
    this.labelErrorVisible = this.labels.length <1;
    this.labelMapErrorVisible = this.mapMarkers.length<2

    if(this.managedSight===undefined){
      this.validForm = this.addSightForm.valid && this.rating!=undefined && this.mapMarkers.length>1 && this.labels.length>0 && !this.addSightInProgress
    }
    else {
      this.validForm = this.addSightForm.valid && this.mapMarkers.length>1 && this.labels.length>0 && !this.addSightInProgress
    }
  }

  /**
   * Adds the current sight that is prepared by the user in the UI. Only available if the form is valid
   */
  onSightAdd() {
    this.checkFormValidity();

    if(!this.validForm)
      return;
    if(this.managedSight===undefined){
      this.addSightInProgress = true;
      const newSight = new Sight();
      const newRating = new Rating();

      newRating.rating = this.rating;
      newRating.comment = this.ratingComment;
      let i:number;
      for(i = 0;i<this.ratingImages.length;i++) {
        newRating.imageNames.push('img_'+i)
      }

      newSight.address = this.addressValue;
      newSight.name = this.nameValue;
      newSight.longitude = this.customLongitude.toString();
      newSight.latitude = this.customLatitude.toString();
      newSight.labelList = this.labels;
      newSight.ratingList.push(newRating);

      this.sightService.addSight(newSight,this.authService.getLoggedInUser().uid).subscribe(async (res)=>
      {
        let i:number;
        let y:number;
        for(i = 0;i<newRating.imageNames.length;i++) {
          const uploadItem = new UploadItem();
          // @ts-ignore
          uploadItem.filePath = 'images/rating/'+res.data.ratingList[0].uid+'/'+newRating.imageNames[i];
          uploadItem.file = this.ratingImages[i];
          await this.firebaseService.uploadFileToFirestore(uploadItem);
        }
        this.addSightInProgress = false;
        this.checkFormValidity();
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = 500;
        dialogConfig.data = {
          type: PopupType.INFO,
          title: 'Success',
          message: 'Sight was added successfully!',
          cancelButton: 'OK'
        }
        this.dialog.open(PopupComponent, dialogConfig).afterClosed().subscribe(()=>{
          this.onAbort();
        });

      },(error => {
        this.addSightInProgress = false;
        this.checkFormValidity();

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = 500;
        dialogConfig.data = {
          type: PopupType.ERROR,
          title: 'Error',
          message: error.error.status.message,
          cancelButton: 'OK'
        }
        this.dialog.open(PopupComponent, dialogConfig);
      }));
    }
    else {

      this.addSightInProgress = true;
      this.managedSight.address = this.addressValue;
      this.managedSight.name = this.nameValue;
      this.managedSight.longitude = this.customLongitude.toString();
      this.managedSight.latitude = this.customLatitude.toString();
      this.managedSight.labelList = this.labels;
      this.managedSight.creator = this.authService.getLoggedInUser().uid;
      this.sightService.updateSight(this.managedSight).subscribe(res=>{

      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.maxWidth = 500;
      dialogConfig.data = {
        type: PopupType.INFO,
        title: 'Success',
        message: 'Sight was updated successfully!',
        cancelButton: 'OK'
      }
        this.addSightInProgress = false;
      this.dialog.open(PopupComponent, dialogConfig).afterClosed().subscribe(()=>{
        this.onAbort();
      });

    },(error => {
      this.addSightInProgress = false;
      this.checkFormValidity();

      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.maxWidth = 500;
      dialogConfig.data = {
        type: PopupType.ERROR,
        title: 'Error',
        message: error.error.status.message,
        cancelButton: 'OK'
      }
      this.dialog.open(PopupComponent, dialogConfig);
    }))

    }


  }

  /**
   * Closes the manage sight form.
   */
  onAbort(){
    if(this.managedSight===undefined){
      this.router.navigateByUrl('/');
    }
    else {
      this.router.navigateByUrl('myelements');
    }
  }
}
