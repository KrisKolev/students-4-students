import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PopupType} from "../../model/popupType";

@Component({
    selector: 'app-login-dialog',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
    title: string;
    type: PopupType;
    message: string;
    cancelButton: string;

    constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<PopupComponent>) {

        if (data) {
            this.type = data.type || this.type;
            this.title = data.title || this.title;
            this.message = data.message || this.message;
            this.cancelButton = data.cancelButton || this.cancelButton;
        }
    }

    closeLoginDialog(): void {
        this.dialogRef.close();
    }

    show() {
        this.dialog.open(PopupComponent);
    }
}