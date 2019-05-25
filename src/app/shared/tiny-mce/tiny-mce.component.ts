import { AfterViewInit, Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as tinymce from 'tinymce';
import 'tinymce/plugins/code/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/lists/plugin';
import 'tinymce/plugins/media/plugin';
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/table/plugin';
import 'tinymce/themes/silver/theme';

@Component({
  selector: 'jtdc-tiny-mce',
  template: `
    <textarea id="{{ uniqueFieldName }}"></textarea>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TinyMceComponent),
    },
  ],
})
export class TinyMceComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @Input() uniqueFieldName?: string;
  @Input() initialContent?: string;

  // tslint:disable-next-line:no-any
  editor: any;

  // tslint:disable-next-line:no-any
  writeValue(obj: any): void {
    if (this.editor) {
      this.editor.setContent(obj);
    }
  }

  // tslint:disable-next-line:no-any
  private onChange: Function = (_: any) => {};

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  // tslint:disable-next-line:no-any
  private onTouched: Function = (_: any) => {};

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // TODO: Should probably do stuff here like!
  }

  ngAfterViewInit(): void {
    tinymce.init({
      selector: '#' + this.uniqueFieldName,
      plugins: ['link', 'paste', 'table', 'lists', 'code', 'media'],
      skin_url: window.location.origin + '/assets/tinymce/skins/lightgray',
      height: '300',
      setup: editor => {
        this.editor = editor;
        editor.on('change', () => {
          this.onChange(editor.getContent());
          this.onTouched();
        });
        editor.on('init', () => {
          editor.setContent(this.initialContent || '');
        });
      },
    });
  }

  clearContents(): void {
    this.editor.setContent('');
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line:no-any
    (tinymce as any).remove(this.editor);
  }
}
