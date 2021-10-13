import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
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

  countryValue: Country =new Country();
  cityValue: City = new City();

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

  constructor(private router: Router,
              private locService: LocationService,
              private authService:UserAuthService,
              private geolocService:GeoLocationService) {

    //create form group
    this.addSightForm = new FormGroup({
      sightName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
      address: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
      city: new FormControl('', [Validators.required,Validators.minLength(2), Validators.maxLength(200)]),
      country: new FormControl('', [Validators.required,Validators.minLength(2), Validators.maxLength(200)]),
    });

    try {
      //get countries
      this.onGetCountry();

      this.onSubscribeToCountryChange();

      this.onSubscribeToCityChange();
    }
    catch {

    }
  }

  //variables
  filteredCountryOptions: Observable<Country[]>;
  selectedCountry: Country;
  countryOptions = [
    new Country()
  ];

  filteredCityOptions: Observable<City[]>;
  selectedCity: City;
  cityOptions = [
      new City()
  ]

  ngOnInit(): void {
    this.initMap();
  }

  onSubscribeToCountryChange(){
    //set the filter options for the country
    this.filteredCountryOptions = this.addSightForm.controls["country"].valueChanges
        .pipe(
            startWith<string | Country>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterCountry(name) : this.countryOptions.slice())
        );
  }

  onSubscribeToCityChange(){
    //set the filter options for the city
    this.filteredCityOptions = this.addSightForm.controls["city"].valueChanges
        .pipe(
            startWith<string | City>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterCity(name) : this.cityOptions.slice())
        );
  }

  onGetCountry(){
    this.locService.getCountries().subscribe((res)=>{
      var pulledCountries=[];

      // @ts-ignore
      var te = res.data as Array;
      te.forEach(ob=>{
        var newCountry = new Country();
        newCountry.name = ob.name;
        newCountry.uid = ob.uid;
        newCountry.latitude = ob.latitude;
        newCountry.longitude = ob.longitude;
        pulledCountries.push(newCountry)
      })

      this.countryOptions = pulledCountries;
      this.addSightForm.controls["country"].updateValueAndValidity();

      if (!navigator.geolocation) {
        this.onCountryValueChanged();
        this.onCityValueChanged();
      } else {
        navigator.geolocation.getCurrentPosition((position => {
          this.geolocService.getGeoInformation(
              position.coords.latitude.toString(),
              position.coords.longitude.toString()).subscribe((res) => {

            var index = this.countryOptions.find(x => x.name == res.countryName);
            if (index != undefined) {
              this.countryValue = index;
              this.selectedCountry = index;
              this.addSightForm.controls["city"].updateValueAndValidity();
              this.setCitiesForCountries(res.city);
            }
          });
        }));
      }


    });
  }

  //Call when the country input changes
  onCountryValueChanged(){
    //subscribe to changes in the value
    this.addSightForm.controls["country"].valueChanges.subscribe((val)=>{

      let index = this.countryOptions.find(x => x.name == val.name);
      if (index == undefined) {
        this.cityOptions = new Array(new City());
        this.addSightForm.controls["city"].updateValueAndValidity();
        return;
      } else {

        //country found
        this.selectedCountry = index;

        this.setCitiesForCountries("");

        this.initMapWithPosition(Number.parseFloat(this.selectedCountry.latitude),Number.parseFloat(this.selectedCountry.longitude),7)
      }
    })
  }

  setCitiesForCountries(specificCity:string){
    this.locService.getCitiesFromCountry(this.selectedCountry.uid).subscribe(res=>{
      var pulledCities=[];

      // @ts-ignore
      var country = res.data as Array;
      country.cities.forEach(city=>{
        var newCity = new City();
        newCity.uid = city.uid;
        newCity.name = city.name;
        newCity.centerLatitude = city.centerLatitude;
        newCity.centerLongitude = city.centerLongitude;
        pulledCities.push(newCity);
      })
      this.addSightForm.controls["city"].setValue("");
      this.selectedCity = undefined;
      this.cityOptions = undefined;
      this.cityOptions = pulledCities;
      this.addSightForm.controls["city"].updateValueAndValidity();
      this.filteredCityOptions = undefined;
      this.onSubscribeToCityChange();

      if(specificCity!=""){
        var index = this.cityOptions.find(x=>x.name.toLowerCase() == specificCity.toLowerCase())
        if(index!=undefined){
          this.selectedCity = index;
          this.cityValue = index;
          this.addSightForm.controls["city"].updateValueAndValidity();
        }
      }

      this.onCountryValueChanged();
      this.onCityValueChanged()

    })
  }


  //Call when the city input changes
  onCityValueChanged(){
    this.addSightForm.controls["city"].valueChanges.subscribe((val)=>{
      let index = this.cityOptions.find(x => x.name == val.name);
      if (index == undefined) {
        this.selectedCity = undefined;
        return;
      }
      else {
        if(val=="")return;
        this.selectedCity = index;
        this.initMapWithPosition(Number.parseFloat(this.selectedCity.centerLatitude),Number.parseFloat(this.selectedCity.centerLongitude),12);
      }
    })
  }

  public displayCountry(country?: Country): string | undefined {
    return country.name ? country.name : undefined;
  }

  public displayCity(city?: City): string | undefined {
    return city.name ? city.name : undefined;
  }

  filterCountry(name: string): Country[] {
    return this.countryOptions.filter(option =>
        option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterCity(name: string): City[] {
    return this.cityOptions.filter(option =>
        option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
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
    if(this.mapMarkers.length>1){
      this.mapMarkers.splice(1,this.mapMarkers.length-1)
    }

    var marker = new google.maps.Marker({
      position: {
        lat: $event.latLng.lat(),
        lng: $event.latLng.lng(),
      },
      map: GoogleMap.prototype.googleMap,
      title: `New sight`,
      label: `New sight`,

      optimized: false,
    });

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
}
