import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class VolumeService {
  readonly volumes = [1, 2, 3, 4, 5, 6, 7, 8].map(x => x / 8);

  volume = new BehaviorSubject<number>(1);

  setVolume(volume: number): void {
    this.volume.next(volume);
  }
}
