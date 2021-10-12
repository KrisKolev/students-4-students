import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {LocationService} from "../../service/http/backend/locations";
import {strict} from "assert";
import {Country} from "../../model/location";

export class UiCountry {
  constructor(public name: string) { }
}

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
    this.filteredOptions = this.addSightForm.controls["country"].valueChanges
        .pipe(
            startWith<string | Country>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filter(name) : this.countryOptions.slice())
        );

    locService.getCountries().subscribe((res)=>{

      var pulledCountries=[];

      // @ts-ignore
      var te = res.data as Array;
      te.forEach(ob=>{
        var newCountry = new Country();
        newCountry.name = ob.name;
        newCountry.id = ob.id;
        pulledCountries.push(newCountry.name)
      })

      this.countryOptions = pulledCountries;
      this.addSightForm.controls["country"].updateValueAndValidity();
    });


  }

  filteredOptions: Observable<Country[]>;

  ngOnInit(): void {
  }


  countryOptions = [
    new Country()
  ];

  public displayFn(country?: Country): string | undefined {
    return country.name ? country.name : undefined;
  }

  filter(name: string): Country[] {
    return this.countryOptions.filter(option =>
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
