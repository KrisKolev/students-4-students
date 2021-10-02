import { Component, OnInit } from '@angular/core';
import {FormControl, Validators} from "@angular/forms";


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  //declarations
  hidePassword = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  psw = new FormControl('')
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
  }

  async onRegister(){
    console.log("register started for: " + this.email.value)


  }
}