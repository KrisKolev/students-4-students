import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-erro-pop-up',
  templateUrl: './erro-pop-up.component.html',
  styleUrls: ['./erro-pop-up.component.scss']
})
export class ErroPopUpComponent implements OnInit {

  constructor(public dialog:MatDialogRef<ErroPopUpComponent>) { }

  ngOnInit(): void {
  }

  closeDialog():void{
    this.dialog.close();
  }
}
