import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {LocationService} from "../../service/http/backend/locations";
import {GoogleMap, MapInfoWindow, MapMarker} from "@angular/google-maps";
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
import {$e} from "codelyzer/angular/styles/chars";

@Component({
  selector: 'app-manage-sight-dialog',
  templateUrl: './manage-sight-dialog.component.html',
  styleUrls: ['./manage-sight-dialog.component.scss']
})
export class ManageSightDialogComponent implements OnInit {


  @ViewChild('labelInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  @ViewChild('addressSearch')
  public searchElementRef: ElementRef;

  addSightForm: FormGroup;
  zoom = 15
  center: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 1,
  }
  mapMarkers = []
  nameValue: any;
  addressValue: string = "";
  private geoCoder;

  rating: any;
  comment: any;

  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  labelCtrl = new FormControl();
  filteredLabels: Observable<Label[]>;
  labels: Label[] = [];
  allLabels: Label[] = [];

  validForm: boolean;

  customLongitude:any;
  customLatitude:any;


  constructor(private router: Router,
              private locService: LocationService,
              private authService:UserAuthService,
              private geolocService:GeoLocationService,
              private ngZone: NgZone,
              private sightService:SightsService) {

    //create form group
    this.addSightForm = new FormGroup({
      sightName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
      address: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
    });

    this.addSightForm.valueChanges.subscribe( ()=>{
      this.checkFormValidity();
    })

    this.onLoadLabels();
  }

  ngOnInit(): void {
    this.initMap();
  }

  checkFormValidity(){
    this.validForm = this.addSightForm.valid && this.rating!=undefined && this.mapMarkers.length>1
  }

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

  public hasError = (controlName: string, errorName: string) => {
    return this.addSightForm.controls[controlName].hasError(errorName);
  }

  onLoadLabels(){

    this.sightService.getLabels().subscribe((val)=>
    {
      var pulledLabels=[];
      // @ts-ignore
      var lab = val.data as Array;
      lab.forEach(ob=>{
        var newLabel = new Label();
        newLabel.name = ob.name;
        newLabel.uid = ob.uid;
        newLabel.color = ob.color;
        pulledLabels.push(newLabel)
      })
      this.allLabels = pulledLabels;
      //this.allLabelsObjects = pulledLabels;

      this.filteredLabels = this.labelCtrl.valueChanges.pipe(
          startWith(null),
          map((tag: String | null) => tag ? this._filter(tag) : this.allLabels.slice()));
    });

  }

  onAbort(){
    this.router.navigateByUrl('/');
  }

  onSightAdd() {
    var newSight = new Sight();
    var newRating = new Rating();

    newRating.rating = this.rating;
    newRating.comment = this.comment;

    newSight.address = this.addressValue;
    newSight.name = this.nameValue;
    newSight.longitude = this.customLongitude.toString();
    newSight.latitude = this.customLatitude.toString();
    newSight.labelList = this.labels;
    newSight.ratingList.push(newRating);

    this.sightService.addSight(newSight).subscribe((res)=>
    {

    });

  }

  onMapClick($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    console.log($event)
    this.placeCustomMarker($event.latLng.lat(),$event.latLng.lng())
    this.initMapWithPosition($event.latLng.lat(),$event.latLng.lng(),16)
  }

  placeCustomMarker(latitude:number, longitude:number){
    if(this.mapMarkers.length>1){
      this.mapMarkers.splice(1,this.mapMarkers.length-1)
    }

    var marker = new google.maps.Marker({
      position: {
        lat: latitude,
        lng: longitude,
      },
      map: GoogleMap.prototype.googleMap,
      title: `New sight`,
      label: `New sight`,

      optimized: false,
    });
    this.customLatitude = latitude;
    this.customLongitude = longitude;
    this.getAddress(latitude, longitude);
    this.mapMarkers.push(marker);
  }

  onGoToLocation() {
    this.initMap();
  }

  initMap(){
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      var marker = new google.maps.Marker({
        position: {
          lat: this.center.lat,
          lng: this.center.lng,
        },
        map: GoogleMap.prototype.googleMap,
        title: `Your position`,
        label: `P`,
        optimized: false,
      });

      this.mapMarkers.push(marker)
    });
  }

  initMapWithPosition(latidute:number, longitude:number,zoom:number){
    this.center = {
      lat: latidute,
      lng: longitude,
    }
    this.zoom = zoom;
  }

  openInfo(marker: MapMarker) {
    this.infoWindow.close();
    this.infoWindow.open(marker);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 16;
          this.addressValue = results[0].formatted_address;
          this.geolocService.getGeoInformation(
              latitude.toString(),
              longitude.toString()).subscribe((res) => {

            //this.setCountryAndCity(res.countryName,res.city);
          });
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  onRatingUpdated($event:any){
    this.rating = $event;
    this.checkFormValidity();
  }

  addTag($event: MatChipInputEvent): void {
    const value = ($event.value || '').trim();

    var label = new Label();
    label.name = value;

    var findLabel = this.labels.find(x=>x.name == label.name)
    var findLabelAll = this.allLabels.find(x=>x.name == label.name);

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

  removeTag(label: Label): void {
    const index = this.labels.indexOf(label);
    if (index >= 0) {
      this.labels.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    var searchLabel = this.allLabels.find(x=>x.name == event.option.viewValue);
    if(searchLabel==undefined)return;

    var searchInLabels = this.labels.find(x=>x.name == searchLabel.name)
    if(searchInLabels != undefined)return;

    this.labels.push(searchLabel);
    this.tagInput.nativeElement.value = '';
    this.labelCtrl.setValue(null);
    this.filteredLabels = null;
    this.filteredLabels = this.labelCtrl.valueChanges.pipe(
        startWith(null),
        map((tag: String | null) => tag ? this._filter(tag) : this.allLabels.slice()));
  }

  private _filter(value: String): Label[] {
    const filterValue = value.toLowerCase();
    return this.allLabels.filter(label => label.name.toLowerCase().includes(filterValue));
  }

  onCommentUpdated($event:any) {
    this.comment = $event;
  }
}
