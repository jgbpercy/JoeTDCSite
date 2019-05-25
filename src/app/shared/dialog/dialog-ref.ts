import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

export class DialogRef<TCloseData> {
  constructor(private overlayRef: OverlayRef) {}

  onClose = new Subject<TCloseData | undefined>();

  close(data?: TCloseData): void {
    this.onClose.next(data);
    this.onClose.complete();
    this.overlayRef.dispose();
  }
}
