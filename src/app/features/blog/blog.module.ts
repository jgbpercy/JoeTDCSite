import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { PostListComponent } from './post-list/post-list.component';

@NgModule({
    imports: [
        SharedModule,
        BlogRoutingModule,
    ],
    declarations: [
        PostListComponent,
    ]
})
export class BlogModule { }
