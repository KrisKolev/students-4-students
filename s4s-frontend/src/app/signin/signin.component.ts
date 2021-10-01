import { Component, OnInit } from '@angular/core';
import {FirebaseService} from "../../service/firebase.service";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  constructor(firebaseService: FirebaseService) {
     firebaseService.signin("test@technikum-wien.at","123456");
  }

  ngOnInit(): void {
  }

}
