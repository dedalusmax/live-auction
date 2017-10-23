import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignallingService } from './shared/services/signalling.service';
import { AuctionModule } from './auction/auction.module';
import { WebRtcService } from './shared/services/web-rtc.service';

const config: SocketIoConfig = { url: 'http://localhost:8988', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    AuctionModule 
  ],
  providers: [SignallingService, WebRtcService],
  bootstrap: [AppComponent]
})
export class AppModule { }
