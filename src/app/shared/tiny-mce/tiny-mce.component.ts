import {
    AfterViewInit,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    Output,
} from '@angular/core';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';

import * as tinymce from 'tinymce';
import 'tinymce/plugins/code/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/lists/plugin';
import 'tinymce/plugins/media/plugin';
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/table/plugin';
import 'tinymce/themes/modern/theme';

@Component({
    selector: 'jtdc-tiny-mce',
    template: `<textarea id="{{uniqueFieldName}}"></textarea>`,
    providers: [
        { 
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => TinyMceComponent),
        }
    ]
})
export class TinyMceComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

    @Input() public uniqueFieldName : string;
    @Input() public initialContent : string;

    public editor;

    public writeValue(obj) : void {
        if (this.editor) {
            this.editor.setContent(obj);
        }
    }

    private onChange : Function = _ => { };

    public registerOnChange(fn : Function) : void {
        this.onChange = fn;
    }

    private onTouched : Function = _ => { };

    public registerOnTouched(fn : Function) : void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled : boolean) : void {
        // TODO: Should probably do stuff here like!
    }

    public ngAfterViewInit() {
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
                    editor.setContent(this.initialContent);
                });
            },
        });
    }

    public clearContents() {
        this.editor.setContent('');
    }

    public ngOnDestroy() {
        tinymce.remove(this.editor);
    }
}
