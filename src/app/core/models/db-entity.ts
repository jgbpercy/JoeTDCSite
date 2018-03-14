export class DbEntity {

    constructor(private _id : string) { }

    public get id() : string {
        return this._id;
    }
}
