import { Component } from '@angular/core';
import { DialogRef } from 'app/shared/dialog';

@Component({
    templateUrl: './confirm-delete-dialog.component.html'
})
export class ConfirmDeleteDialogComponent {

    constructor(private dialogRef : DialogRef<{ confirmed : boolean }>) {}

    public confirm() : void {
        this.dialogRef.close({ confirmed: true });
    }
    
    public cancel() : void {
        this.dialogRef.close();
    }
}
