import * as moment from 'moment';

import { DbEntity } from '../../../core/models';

export class Post extends DbEntity {

    constructor(
        id : string,
        private _title : string,
        private _date : Date,
        private _content : string,
    ) { 
        super(id);
    }

    public get title() : string {
        return this._title;
    }

    public get date() : Date {
        return this._date;
    }

    public get content() : string {
        return this._content;
    }

    public get viewFormattedDate() : string {
        return moment(this._date).format('DD-MM-YYYY');
    }

    public get inputFormattedDate() : string {
        return moment(this._date).format('YYYY-MM-DD');
    }
}

export interface DbPost {
    date : Date;
    title : string;
    content : string;
}
