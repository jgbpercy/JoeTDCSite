import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditBlogComponent, PostListComponent, SinglePostPageComponent } from './components';

const routes : Routes = [
    {
        path: '',
        component: PostListComponent,
    },
    {
        path: 'edit',
        component: EditBlogComponent,
    },
    {
        path: ':postId',
        component: SinglePostPageComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlogRoutingModule { }
