import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [],
    exports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
    ]
})
export class SharedModule { }
