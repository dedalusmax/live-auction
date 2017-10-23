import { Injectable } from '@angular/core';

@Injectable()
export class WebRtcService {

  private localStream: MediaStream;
  
  constructor() { }

  startLocalStream(audio: boolean, video: boolean): Promise<MediaStream> {

      let constraints: MediaStreamConstraints = {};
      constraints.audio = audio;
      constraints.video = video;

      let promise = navigator.mediaDevices.getUserMedia(constraints);
      
      promise.then((stream) => {
        console.log('Started streaming from getUserMedia.');
        this.localStream = stream;
      }, (error) => {
        console.log('Streaming error: ' + error);
      });

      return promise;
  }

  stopLocalStream(): Promise<null> {
    return new Promise<null>((body) => {
      if (this.localStream) {
        for (let track of this.localStream.getTracks()) {
          track.stop();
          console.log('Stopped streaming ' + track.kind + ' track from getUserMedia.');
        }
      }
    });
  }
}
