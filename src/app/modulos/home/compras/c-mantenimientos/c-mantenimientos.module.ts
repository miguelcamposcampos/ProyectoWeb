import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CMantenimientosRoutingModule } from './c-mantenimientos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { CondicionPagoComponent } from './condicion-pago/condicion-pago.component';
import { TipoCambioComponent } from './tipo-cambio/tipo-cambio.component'; 
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { CentroCostoComponent } from './centro-costo/centro-costo.component';
import { VMantenimientosModule } from '../../ventas/v-mantenimientos/v-mantenimientos.module';
import { AMantenimientoModule } from '../../almacen/a-mantenimientos/a-mantenimiento.module';
import { DocumentosComprasComponent } from './documentos-compras/documentos-compras.component'; 
import { NuevoProveedorComponent } from './proveedores/nuevo-proveedor/nuevo-proveedor.component';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module';


@NgModule({
  declarations: [
    CondicionPagoComponent,
    TipoCambioComponent,
    DocumentosComprasComponent,
    ProveedoresComponent,
    CentroCostoComponent,
    NuevoProveedorComponent
  ],
  imports: [
    CommonModule,
    CMantenimientosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule, 
    VMantenimientosModule,
    AMantenimientoModule,
    SharedModulosModule
  ]
})
export class CMantenimientosModule { }
