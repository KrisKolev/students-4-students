import {Component} from '@angular/core';
import {FirebaseService} from '../../service/http/external/firebase.service';
import {FormControl, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {UserAuthService} from "../../service/userAuthService";
import {ErroPopUpComponent} from "../erro-pop-up/erro-pop-up.component";

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
                public errorDialogPopUp: MatDialog,
                private userAuthService: UserAuthService,
                private router: Router) {
    }

    async loginUser(){
        this.userAuthService.login(this.email.value, this.pw.value).then((res) => {
            if (res === true){
                //Successfull
                this.email.setValue('');
                this.pw.setValue('');
                this.closeLoginDialog();
                this.dialogRef.close();
            } else {
                //Failed
                this.openLoginErrorDialog();
            }
        });
    }

    closeLoginDialog(): void {
        this.dialogRef.close();
    }

    openLoginErrorDialog():void{
        const dialog = this.errorDialogPopUp.open(ErroPopUpComponent);
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
