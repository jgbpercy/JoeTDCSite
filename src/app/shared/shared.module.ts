import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Dialog } from './dialog';
import {
    ScrollNotifierDirective,
} from './scroll-notifier/scroll-notifier.directive';
import { TinyMceComponent } from './tiny-mce/tiny-mce.component';

@NgModule({
    imports: [
        CommonModule,
        OverlayModule,
        PortalModule,
    ],
    declarations: [
        TinyMceComponent,
        ScrollNotifierDirective,
    ],
    exports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        TinyMceComponent,
        ScrollNotifierDirective,
        OverlayModule,
        PortalModule,
    ],
    providers: [
        Dialog,
    ]
})
export class SharedModule { }
