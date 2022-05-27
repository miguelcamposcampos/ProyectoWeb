import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VReportesRoutingModule } from './v-reportes-routing.module';
import { RepVendedorComponent } from './rep-vendedor/rep-vendedor.component';
import { RepVentaSunatComponent } from './rep-venta-sunat/rep-venta-sunat.component';
import { RepVentaComponent } from './rep-venta/rep-venta.component';
import { RepTransportistaComponent } from './rep-transportista/rep-transportista.component';
import { RepCondicionDePagoComponent } from './rep-condicion-de-pago/rep-condicion-de-pago.component';
import { RepClienteComponent } from './rep-cliente/rep-cliente.component';
import { RepEstadoCuentaClienteComponent } from './rep-estado-cuenta-cliente/rep-estado-cuenta-cliente.component';
import { RepVentasPorAlmacenComponent } from './rep-ventas-por-almacen/rep-ventas-por-almacen.component';
import { VentasPorClienteRepAnaliticoComponent } from './ventas-por-cliente-rep-analitico/ventas-por-cliente-rep-analitico.component';
import { VentasPorClienteRepResumenComponent } from './ventas-por-cliente-rep-resumen/ventas-por-cliente-rep-resumen.component';
import { VentasPorProductoRepAnaliticoComponent } from './ventas-por-producto-rep-analitico/ventas-por-producto-rep-analitico.component';
import { VentasPorProductoRepResumenComponent } from './ventas-por-producto-rep-resumen/ventas-por-producto-rep-resumen.component';
import { VentasPorProductoRepResumenUtilidadComponent } from './ventas-por-producto-rep-resumen-utilidad/ventas-por-producto-rep-resumen-utilidad.component';
import { VentasPorVendedorRepAnaliticoComponent } from './ventas-por-vendedor-rep-analitico/ventas-por-vendedor-rep-analitico.component';
import { VentasPorVendedorRepResumenComponent } from './ventas-por-vendedor-rep-resumen/ventas-por-vendedor-rep-resumen.component';
import { VentasPorClienteDAOTRepResumenComponent } from './ventas-por-cliente-daot-rep-resumen/ventas-por-cliente-daot-rep-resumen.component';
import { VentasPorClienteDAOTRepAnaliticoComponent } from './ventas-por-cliente-daot-rep-analitico/ventas-por-cliente-daot-rep-analitico.component';
import { RepPedidoAnaliticoComponent } from './rep-pedido-analitico/rep-pedido-analitico.component';
import { RepPedidoResumenComponent } from './rep-pedido-resumen/rep-pedido-resumen.component';
import { RepPlanillaCobranzaComponent } from './rep-planilla-cobranza/rep-planilla-cobranza.component';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module';


@NgModule({
  declarations: [
    RepVendedorComponent,
    RepVentaSunatComponent,
    RepVentaComponent,
    RepTransportistaComponent,
    RepCondicionDePagoComponent,
    RepClienteComponent,
    RepEstadoCuentaClienteComponent,
    RepVentasPorAlmacenComponent,
    VentasPorClienteRepAnaliticoComponent,
    VentasPorClienteRepResumenComponent,
    VentasPorProductoRepAnaliticoComponent,
    VentasPorProductoRepResumenComponent,
    VentasPorProductoRepResumenUtilidadComponent,
    VentasPorVendedorRepAnaliticoComponent,
    VentasPorVendedorRepResumenComponent,
    VentasPorClienteDAOTRepResumenComponent,
    VentasPorClienteDAOTRepAnaliticoComponent,
    RepPedidoAnaliticoComponent,
    RepPedidoResumenComponent,
    RepPlanillaCobranzaComponent
  ],
  imports: [
    CommonModule,
    VReportesRoutingModule,
    PrimeNGModule,
    ReactiveFormsModule, 
    SharedModulosModule
  ]
})
export class VReportesModule { }
