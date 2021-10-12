import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {LocationService} from "../../service/http/backend/locations";
import {strict} from "assert";
import {City, Country} from "../../model/location";

@Component({
  selector: 'app-manage-sight-dialog',
  templateUrl: './manage-sight-dialog.component.html',
  styleUrls: ['./manage-sight-dialog.component.scss']
})
export class ManageSightDialogComponent implements OnInit {
  addSightForm: FormGroup;

  constructor(private router: Router,private locService: LocationService) {

    //create form group
    this.addSightForm = new FormGroup({
      sightName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
      address: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
      postalCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]),
      city: new FormControl('', [Validators.required,Validators.minLength(2), Validators.maxLength(200)]),
      country: new FormControl('', [Validators.required,Validators.minLength(2), Validators.maxLength(200)]),
    });

    //set the filter options for the country
    this.filteredCountryOptions = this.addSightForm.controls["country"].valueChanges
        .pipe(
            startWith<string | Country>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterCountry(name) : this.countryOptions.slice())
        );


    //set the filter options for the city
    this.filteredCityOptions = this.addSightForm.controls["city"].valueChanges
        .pipe(
            startWith<string | City>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterCity(name) : this.cityOptions.slice())
        );

    //get countries
    this.onGetCountry();


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
        locService.getCitiesFromCountry(this.selectedCountry.uid).subscribe(res=>{
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
          this.cityOptions = pulledCities;
          this.addSightForm.controls["city"].updateValueAndValidity();
        })
      }
    })
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
        pulledCountries.push(newCountry)
      })

      this.countryOptions = pulledCountries;
      this.addSightForm.controls["country"].updateValueAndValidity();
    });
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

}
