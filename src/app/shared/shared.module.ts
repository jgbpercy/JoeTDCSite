import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ScrollNotifierDirective } from './scroll-notifier/scroll-notifier.directive';
import { TinyMceComponent } from './tiny-mce/tiny-mce.component';

@NgModule({
    imports: [
        CommonModule,
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
    ]
})
export class SharedModule { }
