import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { BlogRoutingModule } from './blog-routing.module';
import { 
    EditBlogComponent,
    PostComponent,
    PostListComponent,
} from './components';
import { BlogDataService } from './services';

@NgModule({
    imports: [
        SharedModule,
        BlogRoutingModule,
    ],
    declarations: [
        PostListComponent,
        PostComponent,
        EditBlogComponent,
    ],
    providers: [
        BlogDataService,
    ]
})
export class BlogModule { }
