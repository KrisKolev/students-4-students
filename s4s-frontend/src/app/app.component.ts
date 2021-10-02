import {Component} from '@angular/core';
import {BackendCheckService} from '../service/backend_check.service';
import {GeolocationService} from '../service/geolocation.service';
import {UserService} from "../service/user.service";
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FirebaseService} from "../service/firebase.service";
import {FormControl, Validators} from "@angular/forms";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Students4Students';

    //constants + attributes
    isSignedIn = false;

    firebaseService: FirebaseService;

    email = new FormControl('', [Validators.required, Validators.email]);
    psw = new FormControl('')

    hidePassword = true;

    constructor(private backendCheckService: BackendCheckService,
                private geolocationService: GeolocationService,
                public userService: UserService,
                private modalService: NgbModal,
                firebaseService: FirebaseService) {
        this.checkBackendConnection();
        this.initGeolocation();
        this.firebaseService = firebaseService;
    }

    private checkBackendConnection() {
        this.backendCheckService.getEcho().subscribe(res => {
            console.log(res);
        });
    }

    private initGeolocation() {
        if (!navigator.geolocation) {
            console.log('geolocation is not supported!');
        } else {
            navigator.geolocation.getCurrentPosition((position => {
                this.userService.setUserCoords(String(position.coords.latitude), String(position.coords.longitude));

                this.geolocationService.getGeoInformation(
                    this.userService.getUser().latitude,
                    this.userService.getUser().longitude).subscribe(res => {
                    console.log(res);
                    this.userService.setUserLocation(res.countryName, res.city);
                    console.log(this.userService.getUser());
                });
            }));
        }
    }

    //Popup
    closeResult:string;

    open(content) {
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    async onSignin(){
        console.log("login started for: " + this.email.value)
        await this.firebaseService.firebaseSignin(this.email.value,this.psw.value).then((res)=>{
            console.log(res);
            if(res){
                this.email.setValue("");
                this.psw.setValue("");
                this.modalService.dismissAll();
            }
            else{

            }
            }
        );


    }

    getErrorMessage() {
        if (this.email.hasError('required')) {
            return 'You must enter a value';
        }

        return this.email.hasError('email') ? 'Not a valid email' : '';
    }
}
