import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CProcesosRoutingModule } from './c-procesos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module';
import { ComprasComponent } from './compras/compras.component';
import { ReciboporhonorarioComponent } from './reciboporhonorario/reciboporhonorario.component';
import { ImportacionesComponent } from './importaciones/importaciones.component';
import { NuevaCompraComponent } from './compras/nueva-compra/nueva-compra.component';
import { NuevoReciboPorHonorarioComponent } from './reciboporhonorario/nuevo-recibo-por-honorario/nuevo-recibo-por-honorario.component';
import { NuevaImportacionComponent } from './importaciones/nueva-importacion/nueva-importacion.component';
import { OrdenCompraComponent } from './orden-compra/orden-compra.component';
import { NuevaOrdenCompraComponent } from './orden-compra/nueva-orden-compra/nueva-orden-compra.component';
import { OrdenCompraReporteComponent } from './orden-compra/nueva-orden-compra/orden-compra-reporte/orden-compra-reporte.component';


@NgModule({
  declarations: [
    ComprasComponent,
      NuevaCompraComponent,
    ReciboporhonorarioComponent,
      NuevoReciboPorHonorarioComponent,
    ImportacionesComponent,
      NuevaImportacionComponent,
    OrdenCompraComponent,
      NuevaOrdenCompraComponent,
      OrdenCompraReporteComponent
  ],
  imports: [
    CommonModule,
    CProcesosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    SharedModulosModule,
  ]
})
export class CProcesosModule { }
