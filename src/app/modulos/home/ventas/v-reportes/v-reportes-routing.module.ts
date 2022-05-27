import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { RepClienteComponent } from './rep-cliente/rep-cliente.component';
import { RepCondicionDePagoComponent } from './rep-condicion-de-pago/rep-condicion-de-pago.component';
import { RepEstadoCuentaClienteComponent } from './rep-estado-cuenta-cliente/rep-estado-cuenta-cliente.component';
import { RepPedidoAnaliticoComponent } from './rep-pedido-analitico/rep-pedido-analitico.component';
import { RepPedidoResumenComponent } from './rep-pedido-resumen/rep-pedido-resumen.component';
import { RepPlanillaCobranzaComponent } from './rep-planilla-cobranza/rep-planilla-cobranza.component';
import { RepTransportistaComponent } from './rep-transportista/rep-transportista.component';
import { RepVendedorComponent } from './rep-vendedor/rep-vendedor.component';
import { RepVentaSunatComponent } from './rep-venta-sunat/rep-venta-sunat.component';
import { RepVentaComponent } from './rep-venta/rep-venta.component';
import { RepVentasPorAlmacenComponent } from './rep-ventas-por-almacen/rep-ventas-por-almacen.component';
import { VentasPorClienteDAOTRepAnaliticoComponent } from './ventas-por-cliente-daot-rep-analitico/ventas-por-cliente-daot-rep-analitico.component';
import { VentasPorClienteDAOTRepResumenComponent } from './ventas-por-cliente-daot-rep-resumen/ventas-por-cliente-daot-rep-resumen.component';
import { VentasPorClienteRepAnaliticoComponent } from './ventas-por-cliente-rep-analitico/ventas-por-cliente-rep-analitico.component';
import { VentasPorClienteRepResumenComponent } from './ventas-por-cliente-rep-resumen/ventas-por-cliente-rep-resumen.component';
import { VentasPorProductoRepAnaliticoComponent } from './ventas-por-producto-rep-analitico/ventas-por-producto-rep-analitico.component';
import { VentasPorProductoRepResumenUtilidadComponent } from './ventas-por-producto-rep-resumen-utilidad/ventas-por-producto-rep-resumen-utilidad.component';
import { VentasPorProductoRepResumenComponent } from './ventas-por-producto-rep-resumen/ventas-por-producto-rep-resumen.component';
import { VentasPorVendedorRepAnaliticoComponent } from './ventas-por-vendedor-rep-analitico/ventas-por-vendedor-rep-analitico.component';
import { VentasPorVendedorRepResumenComponent } from './ventas-por-vendedor-rep-resumen/ventas-por-vendedor-rep-resumen.component';


const routes: Routes = [
  {
    path: 'rep-cliente',
    component: RepClienteComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'rep-condicion-pago',
    component: RepCondicionDePagoComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'rep-estado-cuenta-cliente',
    component: RepEstadoCuentaClienteComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'rep-pedido-analitico',
    component: RepPedidoAnaliticoComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'rep-pedido-resumen',
    component: RepPedidoResumenComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'rep-planilla-cobranza',
    component: RepPlanillaCobranzaComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'rep-transportista',
    component: RepTransportistaComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'rep-vendedor',
    component: RepVendedorComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'rep-venta',
    component: RepVentaComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'rep-venta-sunat',
    component: RepVentaSunatComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'rep-ventas-por-almacen',
    component: RepVentasPorAlmacenComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'rep-planilla-cobranza',
    component: RepPlanillaCobranzaComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'ventas-por-cliente-daot-rep-analitico',
    component: VentasPorClienteDAOTRepAnaliticoComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'ventas-por-cliente-daot-rep-resumen',
    component: VentasPorClienteDAOTRepResumenComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'ventas-por-cliente-rep-analitico',
    component: VentasPorClienteRepAnaliticoComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'ventas-por-cliente-rep-resumen',
    component: VentasPorClienteRepResumenComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'ventas-por-producto-rep-analitico',
    component: VentasPorProductoRepAnaliticoComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'ventas-por-producto-rep-resumen',
    component: VentasPorProductoRepResumenComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'ventas-por-producto-rep-resumen-utilidad',
    component: VentasPorProductoRepResumenUtilidadComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'ventas-por-vendedor-rep-analitico',
    component: VentasPorVendedorRepAnaliticoComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'ventas-por-vendedor-rep-resumen',
    component: VentasPorVendedorRepResumenComponent,
    canActivate : [AuthGuard],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VReportesRoutingModule { }
