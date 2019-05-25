import { Injectable } from '@angular/core';
import { environment } from 'environment';

export enum LoggerChannel {
  FractalAnimationPerformanceCheck,
}

interface Log {
  channel: LoggerChannel;
  message: string;
}

@Injectable()
export class LoggerService {
  private logs: Log[] = new Array<Log>();

  log(channel: LoggerChannel, message: string): void {
    this.logs.push({ channel, message });

    if (!environment.production) {
      console.log(message);
    }
  }

  getLogString(channel: LoggerChannel): string {
    let logString = '';

    this.logs
      .filter(log => log.channel === channel)
      .forEach(log => {
        logString += log.message + '<br/>';
      });

    return logString;
  }
}
