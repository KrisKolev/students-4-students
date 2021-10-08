import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {RegistrationService} from '../../service/registration.service';
import {Router} from '@angular/router';
import {FirebaseService} from '../../service/firebase.service';

@Component({
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
    hidePassword = true;
    signUpForm: FormGroup;

    ngOnInit(): void {
    }

    constructor(private registrationService: RegistrationService,
                private router: Router,
                private firebaseService: FirebaseService) {

        this.signUpForm = new FormGroup({
            firstname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
            lastname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
            nickname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.min(6)]),
            passwordRepeat: new FormControl('', [Validators.required, Validators.min(6)])
        });

    }

    public hasError = (controlName: string, errorName: string) => {
        return this.signUpForm.controls[controlName].hasError(errorName);
    }

    onAbort(){
        this.router.navigateByUrl('/');
    }

    onSignUp() {
        let email = this.signUpForm.get('email').value;
        let password = this.signUpForm.get('password').value;
        let firstname = this.signUpForm.get('firstname').value;
        let lastname = this.signUpForm.get('lastname').value;
        let nickname = this.signUpForm.get('nickname').value;

        this.registrationService.register(email, password, firstname, lastname, nickname).subscribe((res) => {
            console.log(res);
            this.router.navigateByUrl('/');

            this.firebaseService.firebaseSignin(email, password).then((res) => {
                console.log(res);

                if (res === true) {
                    //Successfull
                    this.firebaseService.login();
                } else {
                    //Failed
                }
            });
        });
    }
}
