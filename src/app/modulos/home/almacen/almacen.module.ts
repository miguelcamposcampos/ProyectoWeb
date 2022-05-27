import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlmacenRoutingModule } from './almacen-routing.module'; 
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module'; 
import { AlmacenComponent } from './almacen.component';

@NgModule({
  declarations: [
    AlmacenComponent,  
  ],
  imports: [
    CommonModule,
    AlmacenRoutingModule,  
    PrimeNGModule, 
  ]
})
export class AlmacenModule { }
