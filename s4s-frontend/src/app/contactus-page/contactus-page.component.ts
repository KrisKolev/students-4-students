import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-contactus-page',
  templateUrl: './contactus-page.component.html',
  styleUrls: ['./contactus-page.component.scss']
})
export class ContactusPageComponent implements OnInit {
  contactUsForm: FormGroup;

  constructor(private router: Router) {
    this. contactUsForm=new FormGroup({
      name: new FormControl('',[Validators.required,Validators.minLength(2), Validators.maxLength(200)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('',[Validators.required,Validators.minLength(5), Validators.maxLength(200)]),
        })
  }

  ngOnInit(): void {
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.contactUsForm.controls[controlName].hasError(errorName);
  }
  onAbort() {
    this.router.navigateByUrl('/');
  }
    checkFormValidity() {
        if (this.hasError('name', 'required') || this.hasError('name', 'minlength') || this.hasError('name', 'maxlength')) {
            return true;
        }
        if (this.hasError('email', 'required') || this.hasError('email', 'email')) {
            return true;
        }
        if (this.hasError('message', 'required') || this.hasError('message', 'minlength') || this.hasError('message', 'maxlength')) {
            return true;
        }
        return false;
    }
}
