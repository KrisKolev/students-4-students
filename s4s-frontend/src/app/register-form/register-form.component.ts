import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {RegistrationService} from '../../service/registration.service';
import {Router} from '@angular/router';
import firebase from 'firebase/compat';
import {FirebaseService} from '../../service/firebase.service';
import {MatDialogRef} from "@angular/material/dialog";


@Component({
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

    //declarations
    hidePassword = true;
    email = new FormControl('', [Validators.required, Validators.email]);
    psw = new FormControl('', [Validators.required]);
    pswRepeat = new FormControl('', [Validators.required]);

    ngOnInit(): void {
    }

    constructor(private registrationService: RegistrationService,
                private router: Router,
                private firebaseService: FirebaseService) {
    }

    getErrorMessage() {
        if (this.email.hasError('required')) {
            return 'You must enter a value';
        }
    }

    async onRegister() {
        this.registrationService.register(this.email.value, this.psw.value).subscribe((res) => {
            console.log(res);
            this.router.navigateByUrl('/');
            this.firebaseService.firebaseSignin(this.email.value, this.psw.value).then((res) => {
                console.log(res);
                if (res === true){
                    //Successfull
                    this.firebaseService.login();
                } else {
                    //Failed
                }
            });
        });
    }
}
