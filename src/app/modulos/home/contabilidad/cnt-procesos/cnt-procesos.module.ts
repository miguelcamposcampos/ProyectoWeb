import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CntProcesosRoutingModule } from './cnt-procesos-routing.module';
import { NuevoAsientoTesoreriaComponent } from './asiento-tesoreria/nuevo-asiento-tesoreria/nuevo-asiento-tesoreria.component';
import { NuevoAsientoDiarioComponent } from './asiento-diario/nuevo-asiento-diario/nuevo-asiento-diario.component';
import { AsientoDiarioComponent } from './asiento-diario/asiento-diario.component';
import { AsientoTesoreriaComponent } from './asiento-tesoreria/asiento-tesoreria.component';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module';


@NgModule({
  declarations: [
    AsientoDiarioComponent,
      NuevoAsientoTesoreriaComponent,
    AsientoTesoreriaComponent,
      NuevoAsientoDiarioComponent
  ],
  imports: [
    CommonModule,
    CntProcesosRoutingModule,
    PrimeNGModule,
    ReactiveFormsModule,
    SharedModulosModule
  ]
})
export class CntProcesosModule { }
