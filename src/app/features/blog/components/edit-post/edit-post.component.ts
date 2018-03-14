import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
 } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
} from '@angular/forms';

import { Post } from '../../models';
import { BlogActionsService } from '../../services';

@Component({
    selector: 'jtdc-edit-post',
    templateUrl: './edit-post.component.html',
})
export class EditPostComponent implements OnChanges {

    @Input() public post : Post;

    public form : FormGroup;
    
    constructor(
        private fb : FormBuilder,
        private blogActionService : BlogActionsService,
    ) { }

    public ngOnChanges(changes : SimpleChanges) : void {
        this.form = this.fb.group({
            'title': this.post.title,
            'date': this.post.inputFormattedDate,
            'content': this.post.content,
        });
    }

    public save() {
        this.blogActionService.savePost(
            {
                title: this.form.controls.title.value,
                date: this.form.controls.date.value,
                content: this.form.controls.content.value,
            },
            this.post.id,
        );
    }
}
