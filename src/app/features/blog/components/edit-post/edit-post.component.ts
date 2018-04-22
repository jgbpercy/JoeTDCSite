import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { DbPost, Post } from '../../models';
import { BlogActionsService } from '../../services';

@Component({
    selector: 'jtdc-edit-post',
    templateUrl: './edit-post.component.html',
})
export class EditPostComponent implements OnChanges {

    @Input() public post : Post;

    @Output() public addPost = new EventEmitter<Observable<string>>();
    @Output() public deletePost = new EventEmitter<void>();

    public form : FormGroup;

    public previewPost : Post;
    
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

        this.previewPost = this.post;

        this.form.valueChanges.subscribe(
            formValues => {
                this.previewPost = new Post(
                    formValues.title,
                    formValues.date,
                    formValues.content,
                    '',
                );
            }
        );
    }

    public save() {

        const postToSave : DbPost = {
            title: this.form.controls.title.value,
            date: this.form.controls.date.value,
            content: this.form.controls.content.value,
        };

        if (this.post.id) {
            this.blogActionService.savePost(
                postToSave,
                this.post.id,
            );
        } else {
            this.addPost.emit(
                this.blogActionService.newPost(postToSave)
            );
        }
    }

    public delete() {
        this.deletePost.emit();
        this.blogActionService.deletePost(this.post.id);
    }
}
