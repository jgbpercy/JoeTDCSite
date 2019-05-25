import { getDefined } from 'app/shared/utils';

export class DbEntity {
  constructor(private _id?: string) {}

  get id(): string {
    return getDefined(this._id);
  }
}
