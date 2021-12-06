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
    currentFirstName;
    currentLastName;
    currentNickname;
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
        this.updatePlaceholders()

    }

    updatePlaceholders() {
        this.loggedInUser = this.userAuthService.getLoggedInUser();
        let splitted = this.loggedInUser.displayName.split(" ")
        this.currentFirstName = splitted[0];
        this.currentLastName = splitted[1];
        this.currentNickname = splitted[2];
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
        if (this.hasError('firstname' || 'lastname' || 'nickname', 'minlength' || 'maxlength', 'profileForm')) {
            this.popup(false);
            return;
        }
        let firstName = this.profileForm.get('firstname').value;
        let lastName = this.profileForm.get('lastname').value;
        let nickname = this.profileForm.get('nickname').value;
        let updatedUser = this.userAuthService.getLoggedInUser();

        if (firstName && lastName && nickname) {
            this.profileService.updateUserProfile(firstName, lastName, nickname, updatedUser.uid).subscribe((res: Response) => {
                console.log(res);

                //updates the localstorage display name
                let currentuser: string = localStorage.getItem("loggedInUser");
                let regex = new RegExp(/(("displayName":")[^"]*)"/);
                let updatedUserString = currentuser.replace(regex, '"displayName":"' + firstName + " " + lastName + " " + nickname + '"');
                regex = (/(("displayName":")[^"]*)"(?=,"email")/);
                updatedUserString = updatedUserString.replace(regex, '"displayName":"' + firstName + " " + lastName + " " + nickname + '"');
                localStorage.setItem("loggedInUser", updatedUserString);
                this.updatePlaceholders()
            });

            this.popup(true);

            return;
        }
        this.popup(false);
    }

    onPasswordChange() {
        if (this.hasError('password', 'minlength', 'passwordForm')) {
        }
        let password = this.passwordForm.get('password').value;
        let passwordRepeat = this.passwordForm.get('passwordRepeat').value;
        if (password != passwordRepeat) return;
        let updatedUser = this.userAuthService.getLoggedInUser();

        if (password && passwordRepeat) {
            this.profileService.updateUserPassword(password, updatedUser.uid).subscribe((res: Response) => {
                console.log(res);
            });
            this.popup(true);
            return;
        }
        this.popup(false);
    }

    //sets the file
    onImagesUpdated(file: File) {
        this.profilePicture = file[0];
    }

    onPictureChange() {
        if (!this.profilePicture){this.popup(false);return;}

        const uploadItem = new UploadItem();
        uploadItem.filePath = 'images/avatars/' + this.loggedInUser.uid + "/img_0";
        uploadItem.file = this.profilePicture;

        this.firebaseService.uploadFileToFirestore(uploadItem).then(res => {
            console.log(res);
            if (res.hasErrors) {
                console.log("There was an issue, when uploading the profile picture!");
                this.popup(false);
                return;
            }

            this.profileService.updateUserAvatar(res.response, this.loggedInUser.uid).subscribe((res: Response) => {
                console.log(res);
                console.log("Profile picture uploaded successfully!")
                window.location.reload();
            });
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
        } else {
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
