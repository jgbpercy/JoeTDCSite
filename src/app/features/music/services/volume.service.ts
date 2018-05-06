import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class VolumeService {

    public readonly volumes = [1, 2, 3, 4, 5, 6, 7, 8].map(x => x / 8);
    
    public volume = new BehaviorSubject<number>(1);

    public setVolume(volume : number) {
        this.volume.next(volume);
    }
}
