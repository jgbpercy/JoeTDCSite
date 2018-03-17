import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Post } from '../../models';

@Component({
    selector: 'jtdc-post',
    templateUrl: './post.component.html',
})
export class PostComponent {

    @Input() public post : Post;

    public showContent = true;

    constructor(
        public domSanitizer : DomSanitizer,
    ) { }

    public toggleShow() : void {
        this.showContent = !this.showContent;
    }
}
