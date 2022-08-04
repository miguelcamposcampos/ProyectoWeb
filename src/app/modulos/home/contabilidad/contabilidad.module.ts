import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContabilidadRoutingModule } from './contabilidad-routing.module';
import { ContabilidadComponent } from './contabilidad.component';
 

@NgModule({
  declarations: [
    ContabilidadComponent, 
  ],
  imports: [
    CommonModule,
    ContabilidadRoutingModule
  ]
})
export class ContabilidadModule { }
