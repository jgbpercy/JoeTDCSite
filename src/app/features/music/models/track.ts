import { DbEntity } from 'app/core/models';

export class Track extends DbEntity {
  constructor(
    private _name: string,
    private _src: string,
    private _downloadUrl: string,
    id?: string,
  ) {
    super(id);
  }

  duration?: string;

  get name(): string {
    return this._name;
  }

  get src(): string {
    return this._src;
  }

  get downloadUrl(): string {
    return this._downloadUrl;
  }
}

export interface DbTrack {
  name: string;
  src: string;
  downloadUrl: string;
}
