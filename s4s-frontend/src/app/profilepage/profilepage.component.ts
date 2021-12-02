import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Form, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserAuthService} from "../../service/userAuthService";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import firebase from "firebase/compat";
import {User} from "../../model/user";
import {ProfileService} from "../../service/http/backend/profile.service";
import {UploadItem, UploadResponse} from "../../model/uploadItem";
import {FirebaseService} from "../../service/http/external/firebase.service";
import {PopupType} from "../../model/popupType";
import {PopupComponent} from "../popup/popup.component";

@Component({
    selector: 'app-profilepage',
    templateUrl: './profilepage.component.html',
    styleUrls: ['./profilepage.component.scss']
})
export class ProfilepageComponent implements OnInit {
    hidePassword = true;
    selectedOption = 'Profile';

    //form groups for each option
    profileForm: FormGroup;
    passwordForm: FormGroup;
    emailForm: FormGroup;
    pictureForm: FormGroup;
    loggedInUser: any;
    profilePicture: File;

    constructor(private router: Router,
                private userAuthService: UserAuthService,
                private dialog: MatDialog,
                private profileService: ProfileService,
                private firebaseService: FirebaseService) {


        this.profileForm = new FormGroup({
            firstname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
            lastname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]),
            nickname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)])
        });
        this.passwordForm = new FormGroup({
            password: new FormControl('', [Validators.required, Validators.min(6)]),
            passwordRepeat: new FormControl('', [Validators.required, Validators.min(6)])
        });
        this.emailForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email])
        });
        this.pictureForm = new FormGroup({
            email: new FormControl('')
        });
    }

    ngOnInit(): void {
        this.loggedInUser = this.userAuthService.getLoggedInUser();
    }

    public hasError = (controlName: string, errorName: string, fg: string) => {
        if (fg == "profileForm") {
            return this.profileForm.controls[controlName].hasError(errorName);
        } else if (fg == "passwordForm") {
            return this.passwordForm.controls[controlName].hasError(errorName);
        } else if (fg == "emailForm") {
            return this.emailForm.controls[controlName].hasError(errorName);
        }
    }

    onAbort() {
        this.router.navigateByUrl('/');
    }

    onProfileChange() {

        let firstName = this.profileForm.get('firstname').value;
        let lastName = this.profileForm.get('lastname').value;
        let nickname = this.profileForm.get('nickname').value;
        let updatedUser = this.userAuthService.getLoggedInUser();

        if (firstName && lastName && nickname) {
            this.profileService.updateUserProfile(firstName, lastName, nickname, updatedUser.uid).subscribe((res: Response) => {
                console.log(res);
                if (res.ok) {
                    console.log(updatedUser.uid);
                }
            });
            this.popup(true);
            return;
        }
        this.popup(false);
    }

    onPasswordChange() {
        let password = this.passwordForm.get('password').value;
        let passwordRepeat = this.passwordForm.get('passwordRepeat').value;
        if (password != passwordRepeat) return;
        let updatedUser = this.userAuthService.getLoggedInUser();

        if (password && passwordRepeat) {
            this.profileService.updateUserPassword(password, updatedUser.uid).subscribe((res: Response) => {
                console.log(res);
                if (res.ok) {
                    console.log(updatedUser.uid);
                }
            });
            this.popup(true);
            return;
        }
        this.popup(false);
    }

    onImagesUpdated(file: File) {
        this.profilePicture = file[0];
        console.log(this.profilePicture)

    }

    onPictureChange() {
        const uploadItem = new UploadItem();
        uploadItem.filePath = 'images/avatars/'+this.loggedInUser.uid +"/img_0";
        uploadItem.file = this.profilePicture;

        this.firebaseService.uploadFileToFirestore(uploadItem);
        this.profileService.updateUserAvatar("img_0",this.loggedInUser.uid).subscribe((res:Response)=>{
            console.log(res);
        });
    }



    popup(success: boolean) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = 500;
        if (success) {
            dialogConfig.data = {
                type: PopupType.ERROR,
                title: 'Success!',
                message: "Information updated successfully!",
                cancelButton: 'OK'
            }
        } else{
            dialogConfig.data = {
                type: PopupType.ERROR,
                title: 'Failure!',
                message: "There was an issue!",
                cancelButton: 'OK'
            }
        }
        const dialogRef = this.dialog.open(PopupComponent, dialogConfig);

    }

}
