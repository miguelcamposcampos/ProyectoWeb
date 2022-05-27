import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';

import { VProcesosRoutingModule } from './v-procesos-routing.module';
import { CobranzasComponent } from './cobranzas/cobranzas.component';
import { VentasComponent } from './ventas/ventas.component';
import { GuiaDeRemisionComponent } from './guia-de-remision/guia-de-remision.component';
import { VentasElectronicasComponent } from './ventas-electronicas/ventas-electronicas.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ResumenBoletasComponent } from './ventas-electronicas/resumen-boletas/resumen-boletas.component';
import { NuevaVentaComponent } from './ventas/nueva-venta/nueva-venta.component';
import { CobrarComponent } from './ventas/nueva-venta/cobrar/cobrar.component';
import { VentaReporteComponent } from './ventas/nueva-venta/venta-reporte/venta-reporte.component';
import { VentaPOSComponent } from './ventas/venta-pos/venta-pos.component';
import { NuevaCobranzaComponent } from './cobranzas/nueva-cobranza/nueva-cobranza.component'; 
import { AProcesosModule } from '../../almacen/a-procesos/a-procesos.module';
import { ReporteCobranzaComponent } from './cobranzas/nueva-cobranza/reporte-cobranza/reporte-cobranza.component';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module';
import { ItemsVentaPosComponent } from './ventas/venta-pos/items-venta-pos/items-venta-pos.component';
import { CajaChicaComponent } from './caja-chica/caja-chica.component';
import { NuevaCajaChicaComponent } from './caja-chica/nueva-caja-chica/nueva-caja-chica.component';
import { NuevoPedidoComponent } from './pedidos/nuevo-pedido/nuevo-pedido.component';
import { ReportePedidoComponent } from './pedidos/reporte-pedido/reporte-pedido.component';
import { ConvertirAVentaComponent } from './pedidos/convertir-a-venta/convertir-a-venta.component';
import { BuscardorPipe } from 'src/app/shared/pipes/buscador.pipe';


@NgModule({
  declarations: [
    CobranzasComponent,
      NuevaCobranzaComponent,
      ReporteCobranzaComponent,
    
    VentasComponent,
      NuevaVentaComponent,
        VentaReporteComponent,
        CobrarComponent,
      VentaPOSComponent,
        ItemsVentaPosComponent,

    
    GuiaDeRemisionComponent,
    
    VentasElectronicasComponent,
      ResumenBoletasComponent,

    PedidosComponent,
      NuevoPedidoComponent,
      ReportePedidoComponent,
      ConvertirAVentaComponent,


    CajaChicaComponent,
      NuevaCajaChicaComponent,
    
    BuscardorPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    SharedModulosModule,
    VProcesosRoutingModule,
    AProcesosModule
  ]
})
export class VProcesosModule { }
