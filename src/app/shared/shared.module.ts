import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TinyMceComponent } from './tiny-mce/tiny-mce.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        TinyMceComponent,
    ],
    exports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        TinyMceComponent,
    ]
})
export class SharedModule { }
