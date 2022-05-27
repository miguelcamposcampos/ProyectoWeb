import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';


@NgModule({
  declarations: [
    VentasComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    PrimeNGModule
  ]
})
export class VentasModule { }
