import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AReportesRoutingModule } from './a-reportes-routing.module';
import { KardexFisicoValorizadoComponent } from './kardex-fisico-valorizado/kardex-fisico-valorizado.component';
import { StockFisicoValorizadoComponent } from './stock-fisico-valorizado/stock-fisico-valorizado.component';
import { ReporteProductoComponent } from './reporte-producto/reporte-producto.component';
import { ReporteLineaComponent } from './reporte-linea/reporte-linea.component';
import { ReporteUnidadMedidaComponent } from './reporte-unidad-medida/reporte-unidad-medida.component';
import { ReporteSalidasAlmacenComponent } from './reporte-salidas-almacen/reporte-salidas-almacen.component';
import { ReporteIngresosAlmacenComponent } from './reporte-ingresos-almacen/reporte-ingresos-almacen.component';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module';
import { ReporteReposicionMercaderiaComponent } from './reporte-reposicion-mercaderia/reporte-reposicion-mercaderia.component';
import { ReporteCruceInventarioComponent } from './reporte-cruce-inventario/reporte-cruce-inventario.component';


@NgModule({
  declarations: [
    KardexFisicoValorizadoComponent,
    StockFisicoValorizadoComponent,
    ReporteProductoComponent,
    ReporteLineaComponent,
    ReporteUnidadMedidaComponent,
    ReporteSalidasAlmacenComponent,
    ReporteIngresosAlmacenComponent,
    ReporteReposicionMercaderiaComponent,
    ReporteCruceInventarioComponent
  ],
  imports: [
    CommonModule,
    AReportesRoutingModule,
    ReactiveFormsModule,
    PrimeNGModule,
    SharedModulosModule,
  ]
})
export class AReportesModule { }
