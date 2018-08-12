import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Type } from '@angular/core';

interface OpenDialogOptions {
    width? : string;
    height? : string;
}

@Injectable()
export class DialogService {
    constructor(private overlay : Overlay) { }

    public open<T>(component : Type<T>, options : OpenDialogOptions = {}) {
      const overlayRef = this.overlay.create(this.getConfig(options));
  
      const filePreviewPortal = new ComponentPortal(component);
  
      overlayRef.attach(filePreviewPortal);
    }

    private getConfig(options : OpenDialogOptions) {
        const positionStrategy = this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically();

        const overlayConfig = new OverlayConfig({
            hasBackdrop: true,
            backdropClass: 'dialog-backdrop',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy,
            width: options.width || '400px',
            height: options.height || '300px',
        });

        return overlayConfig;
    }
}
