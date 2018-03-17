import * as moment from 'moment';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DbEntity } from 'core/models';

const youTubeMarker = '[YouTube=';
const youTubeStartAtMarker = ',T=';

export class Post extends DbEntity {

    private _sanitizedContent : (SafeHtml | string)[];

    constructor(
        id? : string,
        private _title : string = '',
        private _date? : Date,
        private _content : string = '',
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

    public getSanitizedContentWithVideos(sanitizer : DomSanitizer) : (SafeHtml | string)[] {
        if (!this._sanitizedContent) {
            this._sanitizedContent = this._getSanitizedContentWithVideos(sanitizer);
        }
        return this._sanitizedContent;
    }

    // TODO: A more robust thing!
    private _getSanitizedContentWithVideos(sanitizer : DomSanitizer) : (SafeHtml | string)[] {

        const contentArray = new Array<(SafeHtml | string)>();
        let prevYouTubeMarkerEnd = 0;
        let youTubeMarkerIndex = 0;

        while (youTubeMarkerIndex !== -1) {

            youTubeMarkerIndex = this._content.indexOf(youTubeMarker, youTubeMarkerIndex + 1);

            if (youTubeMarkerIndex !== -1) {
                contentArray.push(this._content.substring(prevYouTubeMarkerEnd, youTubeMarkerIndex));

                const startOfIdIndex = this._content.indexOf('\'', youTubeMarkerIndex) + 1;
                const endOfIdIndex = this._content.indexOf('\'', startOfIdIndex);
                const youTubeId = this._content.substring(startOfIdIndex, endOfIdIndex);

                const startOfStartAtExpression = endOfIdIndex + 1;
                const hasStartAt = this._content.substring(
                    startOfStartAtExpression, 
                    startOfStartAtExpression + youTubeStartAtMarker.length
                ) === youTubeStartAtMarker;

                let startAt : string;
                if (hasStartAt) {

                    const startOfStartAtIndex = startOfStartAtExpression + 1 + youTubeStartAtMarker.length;
                    const endOfStartAtIndex = this._content.indexOf('\'', startOfStartAtIndex + 1);
                    startAt = this._content.substring(startOfStartAtIndex, endOfStartAtIndex);

                    prevYouTubeMarkerEnd = endOfStartAtIndex + 2;
                } else {
                    prevYouTubeMarkerEnd = endOfIdIndex + 2;
                }

                contentArray.push(Post.getYouTubeElement(sanitizer, youTubeId, startAt));
            }
        }

        contentArray.push(this._content.substring(prevYouTubeMarkerEnd, this._content.length)); // the rest

        return contentArray;
    }

    private static getYouTubeElement(
        domSanitizer : DomSanitizer,
        youTubeId : string,
        startAt : string,
    ) : SafeHtml {
        if (startAt) {
            // tslint:disable-next-line:max-line-length
            return domSanitizer.bypassSecurityTrustHtml(`<div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${youTubeId}?start=${startAt}" height="500" width="349" frameborder="0" allowfullscreen></iframe></div>`);
        } else {
            // tslint:disable-next-line:max-line-length
            return domSanitizer.bypassSecurityTrustHtml(`<div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${youTubeId}" height="500" width="349" frameborder="0" allowfullscreen></iframe></div>`);
        }
    }
}

export interface DbPost {
    date : Date;
    title : string;
    content : string;
}
