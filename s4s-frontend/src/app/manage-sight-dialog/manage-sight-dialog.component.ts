import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {LocationService} from "../../service/http/backend/locations";
import {City, Country} from "../../model/location";
import {GoogleMap, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {UserAuthService} from "../../service/userAuthService";
import {GeoLocationService} from "../../service/http/external/geoLocation.service";

@Component({
  selector: 'app-manage-sight-dialog',
  templateUrl: './manage-sight-dialog.component.html',
  styleUrls: ['./manage-sight-dialog.component.scss']
})
export class ManageSightDialogComponent implements OnInit {
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

  addressValue: string = "";
  private geoCoder;


  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  @ViewChild('addressSearch')
  public searchElementRef: ElementRef;

  constructor(private router: Router,
              private locService: LocationService,
              private authService:UserAuthService,
              private geolocService:GeoLocationService,
              private ngZone: NgZone) {

    //create form group
    this.addSightForm = new FormGroup({
      sightName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
      address: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)])
    });
  }

  ngOnInit(): void {
    this.initMap();
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

  onAbort(){
    this.router.navigateByUrl('/');
  }

  onSightAdd() {
    let email = this.addSightForm.get('email').value;
    let password = this.addSightForm.get('password').value;
    let firstname = this.addSightForm.get('firstname').value;
    let lastname = this.addSightForm.get('lastname').value;
    let nickname = this.addSightForm.get('nickname').value;

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


}
