import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BlogDataService } from '../../services/blog-data.service';

@Component({
    templateUrl: './edit-blog.component.html'
})
export class EditBlogComponent implements OnInit {

    constructor(
        private fb : FormBuilder,
        public dataService : BlogDataService,
    ) { }

    public ngOnInit() : void {
        
    }
}
