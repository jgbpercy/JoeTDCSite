import { DbEntity } from 'app/core/models';

import { Track } from './';

export class Album extends DbEntity {

    constructor(
        private _name : string,
        private _description : string,
        private _artSrc : string,
        private _tracks : Track[],
        id? : string,
    ) {
        super(id);
    }

    public get name() : string {
        return this._name;
    }

    public get description() : string {
        return this._description;
    }

    public get artSrc() : string {
        return this._artSrc;
    }

    public get tracks() : Track[] {
        return this._tracks;
    }
}

export interface DbAlbum {
    date : Date;
    name : string;
    description : string;
    artSrc : string;
}
