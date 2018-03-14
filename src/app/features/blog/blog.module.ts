import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { BlogRoutingModule } from './blog-routing.module';
import { 
    EditBlogComponent,
    EditPostComponent,
    PostComponent,
    PostListComponent,
} from './components';
import {
    BlogActionsService,
    BlogDataService,
} from './services';

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
    ],
    providers: [
        BlogDataService,
        BlogActionsService,
    ]
})
export class BlogModule { }
