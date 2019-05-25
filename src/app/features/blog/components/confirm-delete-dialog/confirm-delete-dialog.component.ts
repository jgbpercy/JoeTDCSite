import { Component } from '@angular/core';
import { DialogRef } from 'app/shared/dialog';

@Component({
  templateUrl: './confirm-delete-dialog.component.html',
})
export class ConfirmDeleteDialogComponent {
  constructor(private dialogRef: DialogRef<{ confirmed: boolean }>) {}

  confirm(): void {
    this.dialogRef.close({ confirmed: true });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
