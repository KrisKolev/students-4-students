import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserAuthService} from "../../service/userAuthService";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PopupComponent} from "../popup/popup.component";
import {PopupType} from "../../model/popupType";

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

    constructor(private router: Router,
                private userAuthService: UserAuthService,
                private dialog: MatDialog) {

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

    onAbort() {
        this.router.navigateByUrl('/');
    }

    onSignUp() {
        let email = this.signUpForm.get('email').value;
        let password = this.signUpForm.get('password').value;
        let firstname = this.signUpForm.get('firstname').value;
        let lastname = this.signUpForm.get('lastname').value;
        let nickname = this.signUpForm.get('nickname').value;

        this.userAuthService.register(email, password, firstname, lastname, nickname).subscribe((res) => {
            console.log(res);
            this.router.navigateByUrl('/');

            this.userAuthService.login(email, password).then((res) => {
                console.log(res);

                if (res === true) {
                    //Successfull
                } else {
                    //Failed
                }
            });
        }, (error => {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.autoFocus = true;
            dialogConfig.maxWidth = 500;
            dialogConfig.data = {
                type: PopupType.ERROR,
                title: 'Error',
                message: error.error.status.message,
                cancelButton: 'OK'
            }
            const dialogRef = this.dialog.open(PopupComponent, dialogConfig);
        }));
    }
}
