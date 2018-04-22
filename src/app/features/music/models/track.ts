import { DbEntity } from 'app/core/models';

export class Track extends DbEntity {

    constructor(
        private _name : string,
        private _src : string,
        id? : string,
    ) {
        super(id);
    }
    
    public duration? : string;

    public get name() : string {
        return this._name;
    }   
    
    public get src() : string {
        return this._src;
    }
    
}

export interface DbTrack {
    name : string;
    src : string;
}
