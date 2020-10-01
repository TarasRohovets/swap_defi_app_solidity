import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from 'src/app/shared/shared.modules';
import { SwapComponent } from '../swap/swap.component';
import { FormsModule } from '@angular/forms';
import { YieldFarmingComponent } from '../yield-farming/yield-farming.component';


@NgModule({
  declarations: [HomeComponent, SwapComponent, YieldFarmingComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class HomeModule { }
