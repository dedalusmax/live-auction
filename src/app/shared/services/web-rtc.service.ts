import { Injectable } from '@angular/core';
import { SignallingService } from './signalling.service';

@Injectable()
export class WebRtcService {

  private localStream: MediaStream;
  private remoteStream: MediaStream;
  private connection: RTCPeerConnection;
  private connected: boolean;

  constructor(private signalling: SignallingService) { 

    this.signalling.joinRequested().subscribe(data => {
      console.log('joinRequested from user ' + data.userId);
      this.startLocalStream(true, true).then((stream) => {
        this.startPeerCommunication(data.userIdToConnect, data.userId);
      });
    }); 

    this.signalling.rtcMessageReceived().subscribe(data => {
      console.log('rtcMessageReceived from user ' + data.userId);
      // this.rtcMessageReceived(data.userIdToConnect, data.userId, data.message);
    }); 
  }

  startLocalStream(audio: boolean, video: boolean): Promise<MediaStream> {
    // obtains and displays video and audio streams from the local mic and webcam

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

  stopMediaStream(stream): Promise<null> {
    return new Promise<null>((resolve, reject) => {
      if (stream) {
        for (let track of stream.getTracks()) {
          track.stop();
          console.log('Stopped streaming ' + track.kind + ' track from getUserMedia.');
          resolve();
        }
      }
    });
  }

  stopLocalStream(): Promise<null> {
    return this.stopMediaStream(this.localStream);
  }

  stopRemoteStream(): Promise<null> {
    return this.stopMediaStream(this.remoteStream);
  }

  createConnection(userId: number, userIdToConnect: number): RTCPeerConnection {
    // peer connection is going to handle negotiating a network connection with another client, 
    // and keep an open session allowing the two to communicate directly
    let connection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "turn:173.194.72.127:19305?transport=udp",
            "turn:[2404:6800:4008:C01::7F]:19305?transport=udp",
            "turn:173.194.72.127:443?transport=tcp",
            "turn:[2404:6800:4008:C01::7F]:443?transport=tcp"
          ],
          username: "CKjCuLwFEgahxNRjuTAYzc/s6OMT",
          credential: "u1SQDR/SQsPQIxXNWQT7czc/G4c="
        },
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun.services.mozilla.com",
            "stun:stun.skyway.io:3478",
            "stun:stun.stunprotocol.org:3478"
          ]
        }
      ]
    });
    console.log('Created new peer connection.');

    connection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('connection.onicecandidate: ', event.candidate.candidate);
        // each time the client finds a new candidate, it will send it over to the remote peer
        this.signalling.sendRtcMessage(userId, userIdToConnect, JSON.stringify({ "candidate": event.candidate }));
        console.log('Sending RTC message with candidate.');
      }
    };

    // New remote media stream was added
    connection.onaddstream = (event) => {
      console.log('connection.onaddstream');
      this.remoteStream = event.stream;
    };

    // media stream was closed
    connection.onremovestream = (event) => {
      console.log('connection.onremovestream: ' + event);
      if (this.remoteStream) {
        for (let track of this.remoteStream.getTracks()) {
          track.stop();
          console.log('Stopped streaming ' + track.kind + ' track from getUserMedia.');
        }
      }
    };

    connection.oniceconnectionstatechange = (event: any) => {
      console.log('connection.oniceconnectionstatechange: ', event.target.iceConnectionState);

      if (event.target.iceConnectionState == 'connected' || event.target.iceConnectionState == 'completed') {
        this.connected = true;
      } else {
        this.connected = false;
      }

      // turn off remote video  
      if (event.target.iceConnectionState == 'disconnected') {
        console.log('Closing connections and streams.');
        this.closeConnectionAndStreams();
      }
    };

    connection.onicegatheringstatechange = (event: any) => {
      console.log('connection.oniceconnectionstatechange: ', event.target.iceGatheringState);
    };

    connection.onnegotiationneeded = (event) => {
      console.log('connection.onnegotiationneeded.');
    };

    connection.onsignalingstatechange = (event: any) => {
      console.log('connection.onsignalingstatechange: ', event.target.signalingState);

      // notify selected user to turn on camera
      if (event.target.signalingState == 'have-remote-offer') {
        console.log('Someone is calling you..');
      }
      // calling someone
      if (event.target.signalingState == 'have-local-offer') {
        console.log('Calling..');
      }

      // hang up
      if (event.target.signalingState == 'closed') {
        console.log('Call ended..');
      }
    };
    return connection;
  }

  startPeerCommunication(userId: number, userIdToConnect: number) {

    this.connection = this.connection || this.createConnection(userId, userIdToConnect);

    // adding the stream we received from 'getUserMedia' into the connection object
    this.connection.addStream(this.localStream);
    console.log('Added stream local stream.');

    // we need to create and send a WebRTC offer over to the peer we would like to connect with
    this.connection.createOffer((desc) => {
      console.log('Created offer.');

      // set the generated SDP to be our local session description
      this.connection.setLocalDescription(desc, function () {
        console.log('Local description set.');

        // store offer description into the cooking itself and send it to all interested parties
        this.signalling.sendRtcMessage(userId, userIdToConnect, JSON.stringify({ "sdp": desc }));
        console.log('Sending RTC message with SDP.');
      });
    }, (error) => {
      console.log('Error in creating offer: ' + error);
    });
  }

  closeConnectionAndStreams() {
    // turn off connection
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }

    // turn off media streams
    this.stopRemoteStream();
    this.stopLocalStream();
  }

  rtcMessageReceived() {

  }
}
