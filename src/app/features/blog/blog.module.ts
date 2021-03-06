import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'shared/shared.module';

import { BlogRoutingModule } from './blog-routing.module';
import {
    ConfirmDeleteDialogComponent,
    EditBlogComponent,
    EditPostComponent,
    PostComponent,
    PostListComponent,
    SinglePostPageComponent,
} from './components';
import { BlogActionsService, BlogDataService } from './services';

@NgModule({
    imports: [
        SharedModule,
        BlogRoutingModule,
        ReactiveFormsModule,
    ],
    declarations: [
        PostListComponent,
        PostComponent,
        EditBlogComponent,
        EditPostComponent,
        ConfirmDeleteDialogComponent,
        SinglePostPageComponent,
    ],
    providers: [
        BlogDataService,
        BlogActionsService,
    ],
    entryComponents:  [
        ConfirmDeleteDialogComponent,
    ]
})
export class BlogModule { }
