import { Injectable } from '@angular/core';

//TODO: Fix this to be absolute path import
import { environment } from 'environment';

export enum LoggerChannel {
    FractalAnimationPerformanceCheck
}

interface Log {
    channel : LoggerChannel;
    message : string;
}

@Injectable()
export class LoggerService {

    private logs : Log[] = new Array<Log>();

    public log(channel : LoggerChannel, message : string) {
        this.logs.push({ channel, message });

        if (!environment.production) {
            console.log(message);
        }
    }

    public getLogString(channel : LoggerChannel) : string {

        let logString = '';

        this.logs.filter(log => log.channel === channel).forEach(log => {
            logString += log.message + '<br/>';
        });
        
        return logString;
    }
}
