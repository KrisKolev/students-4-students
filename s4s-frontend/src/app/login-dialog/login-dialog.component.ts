import {Component} from '@angular/core';
import {FirebaseService} from '../../service/external/firebase.service';
import {FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

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
                private firebaseService: FirebaseService,
                private router: Router) {
    }

    async loginUser(){
        this.firebaseService.firebaseSignin(this.email.value, this.pw.value).then((res) => {
            if (res === true){
                //Successfull
                this.email.setValue('');
                this.pw.setValue('');
                this.closeLoginDialog();
                this.firebaseService.login();
                this.dialogRef.close();
            } else {
                //Failed
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
