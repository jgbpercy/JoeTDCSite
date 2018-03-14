import { Component, Input } from '@angular/core';

import { Post } from '../../models';

@Component({
    selector: 'jtdc-post',
    templateUrl: './post.component.html',
})
export class PostComponent {

    @Input() public post : Post;

    public showContent = true;

    public toggleShow() : void {
        this.showContent = !this.showContent;
    }
}
