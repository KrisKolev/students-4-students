import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {RegistrationService} from '../../service/registration.service';


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

    constructor(private registrationService: RegistrationService) {
    }

    getErrorMessage() {
        if (this.email.hasError('required')) {
            return 'You must enter a value';
        }
    }

    async onRegister() {
        this.registrationService.register(this.email.value, this.psw.value).subscribe((res) => {
            console.log(res);
        });
    }
}
