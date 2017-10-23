import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map';
import { Socket } from 'ng-socket-io';

@Injectable()
export class SignallingService {

  constructor(private socket: Socket) { }

  getMessage() {
    return this.socket.fromEvent<any>('msg').map(data => data.msg);
  }

  sendMessage(msg: string) {
    this.socket.emit('msg', msg);
  }

  getUsers() {
    return this.socket.fromEvent<any>('users');
  }

  connectUser(userId: number) {
    this.socket.emit('connectUser', userId);
  }

  disconnectUser(userId: number) {
    this.socket.emit('disconnectUser', userId);
  }

  userConnected() {
    return this.socket.fromEvent<any>('userConnected');
  }

  userDisconnected() {
    return this.socket.fromEvent<any>('userDisconnected');
  }

  close() {
    this.socket.disconnect();
  }
}
