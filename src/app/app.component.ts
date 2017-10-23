import { Component } from '@angular/core';
import { SignallingService } from './shared/services/signalling.service';

@Component({
  selector: 'app-root',
  template: `

  <div>
  <input type="text" #msgInput name="" value="">
  <button (click)="sendMsg(msgInput.value)">Send</button>
  <br>
  <p>{{msg}}  </p>
</div>

    <router-outlet></router-outlet>
  `,
  styles: [],
  providers: [SignallingService]
})
export class AppComponent {

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
