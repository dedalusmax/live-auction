import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuctionRoutingModule } from './auction-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignallingService } from '../shared/services/signalling.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AuctionRoutingModule
  ],
  declarations: [DashboardComponent],
  providers: [SignallingService]
})
export class AuctionModule { }
