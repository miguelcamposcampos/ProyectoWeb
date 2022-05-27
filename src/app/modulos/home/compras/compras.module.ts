import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { ComprasComponent } from './compras.component';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';


@NgModule({
  declarations: [
    ComprasComponent
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    PrimeNGModule
  ]
})
export class ComprasModule { }
