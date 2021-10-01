import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../../service/firebase.service";
import {FormControl, Validators} from '@angular/forms';
import firebase from "firebase/compat";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(firebaseService: FirebaseService) {
    this.firebaseService = firebaseService;
     firebaseService.firebaseSignin("test@technikum-wien.at","123456");
  }

  //constants + attributes
  isSignedIn = false;

  firebaseService: FirebaseService;

  email = new FormControl('', [Validators.required, Validators.email]);
  psw = new FormControl('')

  hidePassword = true;

  ngOnInit(): void {
  }

  async onSignin(){
    console.log("login started for: " + this.email.value)
    await this.firebaseService.firebaseSignin(this.email.value,this.psw.value);

  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}
