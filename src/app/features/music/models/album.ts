import { DbEntity } from 'app/core/models';
import { Track } from './';

export class Album extends DbEntity {
  constructor(
    private _name: string,
    private _description: string,
    private _artSrc: string,
    private _tracks: Track[],
    private _downloadUrl: string,
    id?: string,
  ) {
    super(id);
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get artSrc(): string {
    return this._artSrc;
  }

  get tracks(): Track[] {
    return this._tracks;
  }

  get downloadUrl(): string {
    return this._downloadUrl;
  }
}

export interface DbAlbum {
  date: Date;
  name: string;
  description: string;
  artSrc: string;
  downloadUrl: string;
}
