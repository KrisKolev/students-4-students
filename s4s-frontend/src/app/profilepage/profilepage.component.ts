import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Form, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserAuthService} from "../../service/userAuthService";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-profilepage',
  templateUrl: './profilepage.component.html',
  styleUrls: ['./profilepage.component.scss']
})
export class ProfilepageComponent implements OnInit {
  hidePassword = true;
  selectedOption= 'Profile';

  //form groups for each option
  profileForm:FormGroup;
  passwordForm:FormGroup;
  emailForm:FormGroup;
  pictureForm:FormGroup;

  constructor(private router: Router,
              private userAuthService: UserAuthService,
              private dialog: MatDialog) {

    this.profileForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
      nickname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)])
    });
    this.passwordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.min(6)]),
      passwordRepeat: new FormControl('', [Validators.required, Validators.min(6)])
    });
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
    this.pictureForm = new FormGroup({
      email: new FormControl('')
    });
  }

  ngOnInit(): void {
  }
  public hasError = (controlName: string, errorName: string,fg:string) => {
    if (fg=="profileForm")
    {
      return this.profileForm.controls[controlName].hasError(errorName);
    }
    else if(fg=="passwordForm")
    {
      return this.passwordForm.controls[controlName].hasError(errorName);
    }
    else if(fg=="emailForm")
    {
      return this.emailForm.controls[controlName].hasError(errorName);
    }
  }
  onAbort() {
    this.router.navigateByUrl('/');
  }
}
