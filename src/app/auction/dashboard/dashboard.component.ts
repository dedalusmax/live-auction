import { Component, OnInit } from '@angular/core';
import { SignallingService } from '../../shared/services/signalling.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private msg: string;

  constructor(private signalling: SignallingService) { }

  ngOnInit() {
    this.signalling.getMessage().subscribe(msg => {
      this.msg = "1st " + msg;
    });
  }

  sendMsg(msg) {
    this.signalling.sendMessage(msg);
  }
}
