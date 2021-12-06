import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {UserAuthService} from "../../service/userAuthService";
import {PopupType} from "../../model/popupType";
import {PopupComponent} from "../popup/popup.component";
import {Emitters} from "../emitters/emitters";

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
    hidePassword = true;
    email = new FormControl('', [Validators.required, Validators.email]);
    pw = new FormControl('');


    constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
                public dialog: MatDialog,
                private userAuthService: UserAuthService,
                private router: Router) {


    }

    async loginUser(){
        this.userAuthService.login(this.email.value, this.pw.value).then((res) => {
            if (res === true){
                //Successfull
                this.email.setValue('');
                this.pw.setValue('');
                Emitters.pfpEmitter.emit(true);
                this.closeLoginDialog();
                this.dialogRef.close();
            } else {
                //Failed
                const dialogConfig = new MatDialogConfig();
                dialogConfig.autoFocus = true;
                dialogConfig.maxWidth = 500;
                dialogConfig.data = {
                    type: PopupType.ERROR,
                    title: 'Error',
                    message: 'Login failed. Please check your credentials.',
                    cancelButton: 'OK'
                }
                const dialogRef = this.dialog.open(PopupComponent, dialogConfig);
            }
        });
    }

    closeLoginDialog(): void {
        this.dialogRef.close();
    }

    signUp() {
        this.closeLoginDialog();
        this.router.navigateByUrl('/register');
    }

    getErrorMessage() {
        if (this.email.hasError('required')) {
            return 'You must enter a value';
        }

        return this.email.hasError('email') ? 'Not a valid email' : '';
    }
}
