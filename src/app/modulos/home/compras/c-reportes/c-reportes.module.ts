import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CReportesRoutingModule } from './c-reportes-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { CompraFormatoSunatComponent } from './compra-formato-sunat/compra-formato-sunat.component';
import { CompraProveedorAnaliticoComponent } from './compra-proveedor-analitico/compra-proveedor-analitico.component';
import { CompraProductoAnaliticoComponent } from './compra-producto-analitico/compra-producto-analitico.component';
import { CompraProductoResumenComponent } from './compra-producto-resumen/compra-producto-resumen.component'; 
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { DetraccionesComponent } from './detracciones/detraccionesn.component';
import { CompraProveedorDaotAnaliticoComponent } from './compra-proveedor-daot-analitico/compra-proveedor-daot-analitico.component';
import { CompraProveedorDaotResumenComponent } from './compra-proveedor-daot-resumen/compra-proveedor-daot-resumen.component';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module';


@NgModule({
  declarations: [
    CompraFormatoSunatComponent,
    CompraProveedorAnaliticoComponent,
    CompraProductoAnaliticoComponent,
    CompraProductoResumenComponent,
    DetraccionesComponent,
    ProveedoresComponent,
    CompraProveedorDaotAnaliticoComponent,
    CompraProveedorDaotResumenComponent
  ],
  imports: [
    CommonModule,
    CReportesRoutingModule,
    ReactiveFormsModule,
    PrimeNGModule,
    SharedModulosModule
  ]
})
export class CReportesModule { }
