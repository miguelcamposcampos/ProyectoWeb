import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { KardexFisicoValorizadoComponent } from './kardex-fisico-valorizado/kardex-fisico-valorizado.component';
import { ReporteCruceInventarioComponent } from './reporte-cruce-inventario/reporte-cruce-inventario.component';
import { ReporteIngresosAlmacenComponent } from './reporte-ingresos-almacen/reporte-ingresos-almacen.component';
import { ReporteLineaComponent } from './reporte-linea/reporte-linea.component';
import { ReporteProductoComponent } from './reporte-producto/reporte-producto.component';
import { ReporteReposicionMercaderiaComponent } from './reporte-reposicion-mercaderia/reporte-reposicion-mercaderia.component';
import { ReporteSalidasAlmacenComponent } from './reporte-salidas-almacen/reporte-salidas-almacen.component';
import { ReporteUnidadMedidaComponent } from './reporte-unidad-medida/reporte-unidad-medida.component';
import { StockFisicoValorizadoComponent } from './stock-fisico-valorizado/stock-fisico-valorizado.component';

const routes: Routes = [
  {
    path: 'kardex-fisico-valorizado',
    component: KardexFisicoValorizadoComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'stock-fisico-valorizado',
    component: StockFisicoValorizadoComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'reporte-productos',
    component: ReporteProductoComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'reporte-linea',
    component: ReporteLineaComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'reporte-unidad-medida',
    component: ReporteUnidadMedidaComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'reporte-salidas-almacen',
    component: ReporteSalidasAlmacenComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'reporte-ingresos-almacen',
    component: ReporteIngresosAlmacenComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'reporte-reposicion-mercaderia',
    component: ReporteReposicionMercaderiaComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'reporte-cruce-inventario',
    component: ReporteCruceInventarioComponent,
    canActivate : [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AReportesRoutingModule { }
