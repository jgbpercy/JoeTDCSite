import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Dialog } from 'app/shared/dialog';
import { getDefined } from 'app/shared/utils';
import { Observable } from 'rxjs';
import { DbPost, Post } from '../../models';
import { BlogActionsService } from '../../services';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'jtdc-edit-post',
  templateUrl: './edit-post.component.html',
})
export class EditPostComponent implements OnChanges {
  @Input('post') _post?: Post;
  get post(): Post {
    return getDefined(this._post, 'post input is mandatory');
  }

  @Output() addPost = new EventEmitter<Observable<string>>();
  @Output() deletePost = new EventEmitter<void>();

  form = this.fb.group({
    title: this.fb.control(null),
    date: this.fb.control(null),
    content: this.fb.control(null),
  });

  previewPost?: Post;

  constructor(
    private fb: FormBuilder,
    private blogActionService: BlogActionsService,
    private dialog: Dialog,
  ) {}

  ngOnChanges(): void {
    this.form.setValue({
      title: this.post.title,
      date: this.post.inputFormattedDate,
      content: this.post.content,
    });

    this.previewPost = this.post;

    this.form.valueChanges.subscribe(formValues => {
      this.previewPost = new Post(formValues.title, formValues.date, formValues.content, '');
    });
  }

  save(): void {
    const postToSave: DbPost = {
      title: this.form.controls.title.value,
      date: this.form.controls.date.value,
      content: this.form.controls.content.value,
    };

    if (this.post.id) {
      this.blogActionService.savePost(postToSave, this.post.id);
    } else {
      this.addPost.emit(this.blogActionService.newPost(postToSave));
    }
  }

  delete(): void {
    this.dialog
      .open<{}, { confirmed: boolean }, ConfirmDeleteDialogComponent>(
        ConfirmDeleteDialogComponent,
        { closeOnBackdropClick: true },
      )
      .onClose.subscribe(closeData => {
        if (closeData && closeData.confirmed) {
          this.deletePost.emit();
          this.blogActionService.deletePost(this.post.id);
        }
      });
  }
}
