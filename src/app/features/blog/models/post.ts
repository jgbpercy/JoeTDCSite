import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getDefined } from 'app/shared/utils';
import { DbEntity } from 'core/models';
import * as moment from 'moment';

const youTubeMarker = '[YouTube=';
const youTubeStartAtMarker = ',T=';

export class Post extends DbEntity {
  private _sanitizedContent?: (SafeHtml | string)[];

  constructor(
    private _title: string = '',
    private _date?: Date,
    private _content: string = '',
    id?: string,
  ) {
    super(id);
  }

  get title(): string {
    return this._title;
  }

  get date(): Date {
    return getDefined(this._date);
  }

  get content(): string {
    return this._content;
  }

  get viewFormattedDate(): string {
    return moment(this._date).format('DD-MM-YYYY');
  }

  get inputFormattedDate(): string {
    return moment(this._date).format('YYYY-MM-DD');
  }

  getSanitizedContentWithVideos(sanitizer: DomSanitizer): (SafeHtml | string)[] {
    if (!this._sanitizedContent) {
      this._sanitizedContent = this._getSanitizedContentWithVideos(sanitizer);
    }
    return this._sanitizedContent;
  }

  /*  TODO: A more robust thing!
        So it would probably be safe just to bypassSecurityTrustHtml the whole post content, because the
        server will (should) ensure that only someone authed on the server can push content to posts, and
        posts can only come from the server, so to my understanding XSS wouldn't (shouldn't) be an issue.
        But that doesn't seem like a brilliant idea, because who's to say I don't forget that and use the 
        post object later for something that can be entered by joe public?
        So this, at time of writing, looks for [YouTube='youtubeid',T='timeToStartAt']. It's not currently
        a very robust implementations! But it works fine for now for that single use case, and it means that
        only links to YouTube are sanitized.
    */
  private _getSanitizedContentWithVideos(sanitizer: DomSanitizer): (SafeHtml | string)[] {
    const contentArray = new Array<SafeHtml | string>();
    let prevYouTubeMarkerEnd = 0;
    let youTubeMarkerIndex = 0;

    while (youTubeMarkerIndex !== -1) {
      youTubeMarkerIndex = this._content.indexOf(youTubeMarker, youTubeMarkerIndex + 1);

      if (youTubeMarkerIndex !== -1) {
        contentArray.push(this._content.substring(prevYouTubeMarkerEnd, youTubeMarkerIndex));

        const startOfIdIndex = this._content.indexOf("'", youTubeMarkerIndex) + 1;
        const endOfIdIndex = this._content.indexOf("'", startOfIdIndex);
        const youTubeId = this._content.substring(startOfIdIndex, endOfIdIndex);

        const startOfStartAtExpression = endOfIdIndex + 1;
        const hasStartAt =
          this._content.substring(
            startOfStartAtExpression,
            startOfStartAtExpression + youTubeStartAtMarker.length,
          ) === youTubeStartAtMarker;

        let startAt: string | undefined;
        if (hasStartAt) {
          const startOfStartAtIndex = startOfStartAtExpression + 1 + youTubeStartAtMarker.length;
          const endOfStartAtIndex = this._content.indexOf("'", startOfStartAtIndex + 1);
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
    domSanitizer: DomSanitizer,
    youTubeId: string,
    startAt?: string,
  ): SafeHtml {
    if (startAt) {
      // tslint:disable-next-line:max-line-length
      return domSanitizer.bypassSecurityTrustHtml(
        `<div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${youTubeId}?start=${startAt}" height="500" width="349" frameborder="0" allowfullscreen></iframe></div>`,
      );
    } else {
      // tslint:disable-next-line:max-line-length
      return domSanitizer.bypassSecurityTrustHtml(
        `<div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${youTubeId}" height="500" width="349" frameborder="0" allowfullscreen></iframe></div>`,
      );
    }
  }
}

export interface DbPost {
  date: Date;
  title: string;
  content: string;
}
