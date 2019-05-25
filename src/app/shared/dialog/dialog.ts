import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { DialogRef } from './dialog-ref';

interface OpenDialogOptions<TData, TCloseData> {
  width?: string;
  height?: string;
  closeOnBackdropClick?: boolean;
  data?: TData;
  defaultCloseData?: TCloseData;
}

export const DIALOG_DATA = new InjectionToken<unknown>('DIALOG_DATA');

@Injectable()
export class Dialog {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<TData, TCloseData, TComponent>(
    component: Type<TComponent>,
    options: OpenDialogOptions<TData, TCloseData> = {},
  ): DialogRef<TCloseData> {
    const overlayRef = this.overlay.create(this.getConfig(options));

    const dialogRef = new DialogRef<TCloseData>(overlayRef);

    const componentPortal = new ComponentPortal(
      component,
      null,
      this.createInjector(dialogRef, options.data),
    );

    overlayRef.attach(componentPortal);

    if (options.closeOnBackdropClick) {
      overlayRef.backdropClick().subscribe(() => dialogRef.close(options.defaultCloseData));
    }

    return dialogRef;
  }

  private getConfig<TData, TCloseData>(
    options: OpenDialogOptions<TData, TCloseData>,
  ): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
      panelClass: 'dialog-panel',
      width: options.width,
      height: options.height,
    });

    return overlayConfig;
  }

  private createInjector<TData, TCloseData>(
    dialogRef: DialogRef<TCloseData>,
    data?: TData,
  ): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(DialogRef, dialogRef);
    injectionTokens.set(DIALOG_DATA, data);

    return new PortalInjector(this.injector, injectionTokens);
  }
}
