import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AProcesosRoutingModule } from './a-procesos-routing.module';
import { ConsultaStockComponent } from './consulta-stock/consulta-stock.component';
import { MovimientosAlmacenComponent } from './movimientos-almacen/movimientos-almacen.component';
import { GuiasDeRemisionComponent } from './guias-de-remision/guias-de-remision.component';
import { NuevoIngresoComponent } from './movimientos-almacen/nuevo-ingreso/nuevo-ingreso.component'; 
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module';   
import { NuevaGuiaRemisionComponent } from './guias-de-remision/nueva-guia-remision/nueva-guia-remision.component';
import { MovimientoReporteComponent } from './movimientos-almacen/nuevo-ingreso/movimiento-reporte/movimiento-reporte.component';
import { GuiaReporteComponent } from './guias-de-remision/nueva-guia-remision/guia-reporte/guia-reporte.component';
import { TomaInventarioComponent } from './toma-inventario/toma-inventario.component'; 
 
 

@NgModule({
  declarations: [
    ConsultaStockComponent,

    MovimientosAlmacenComponent,
      NuevoIngresoComponent,   
      MovimientoReporteComponent,


    GuiasDeRemisionComponent,
      NuevaGuiaRemisionComponent,
      GuiaReporteComponent,
     
    TomaInventarioComponent
  ],
  
  imports: [
    CommonModule,
    AProcesosRoutingModule,
    ReactiveFormsModule,
    PrimeNGModule,  
    SharedModulosModule,  
  ],

  exports: [
    GuiasDeRemisionComponent,
    NuevaGuiaRemisionComponent,
    GuiaReporteComponent
  ]
})
export class AProcesosModule { }
