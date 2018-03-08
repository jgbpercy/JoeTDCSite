import { Component, Input } from '@angular/core';

import { ViewPost } from '../post-list/post-list.component';

@Component({
    selector: 'jtdc-post',
    templateUrl: './post.component.html',
})
export class PostComponent {

    @Input() public post : ViewPost;

    public showContent = true;

    public toggleShow() : void {
        this.showContent = !this.showContent;
    }
}
