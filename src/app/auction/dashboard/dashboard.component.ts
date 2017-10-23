import { Component, OnInit } from '@angular/core';
import { SignallingService } from '../../shared/services/signalling.service';
import { WebRtcService } from '../../shared/services/web-rtc.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private msg: string; 
  private streaming: boolean;

  private selectedUser;
  private users = [];

  constructor(private signalling: SignallingService, private webRtc: WebRtcService) { }

  ngOnInit() {
    this.signalling.getMessage().subscribe(msg => {
      this.msg = "1st " + msg;
    });

    this.signalling.getUsers().subscribe(users => {
      this.users = users;
    });

    this.signalling.userConnected().subscribe(userId => {
      this.users.find(u => u.id === userId).connected = true;
    });

    this.signalling.userDisconnected().subscribe(userId => {
      this.users.find(u => u.id === userId).connected = false;
    });   
  }

  sendMsg(msg) {
    this.signalling.sendMessage(msg);
  }

  start() {
    this.webRtc.startLocalStream(false, true).then((stream) => {
      let videoElement: HTMLVideoElement;
      videoElement = document.querySelector('#localVideo') as HTMLVideoElement;
      videoElement.srcObject = stream;

      this.streaming = true;
      this.signalling.connectUser(this.selectedUser.id);
    });
  }

  stop() {
    this.webRtc.stopLocalStream().then(() => {
      let videoElement: HTMLVideoElement;
      videoElement = document.querySelector('#localVideo') as HTMLVideoElement;
      videoElement.srcObject = null;

      this.streaming = false;     
      this.signalling.disconnectUser(this.selectedUser.id);     
    });
  };
}
