import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VMantenimientosRoutingModule } from './v-mantenimientos-routing.module';
import { ClientesComponent } from './clientes/clientes.component';
import { VendedoresComponent } from './vendedores/vendedores.component';
import { CondicionDePagoComponent } from './condicion-de-pago/condicion-de-pago.component';
import { FormasDePagoComponent } from './formas-de-pago/formas-de-pago.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { TipoDeCambioComponent } from './tipo-de-cambio/tipo-de-cambio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { NuevoVendedorComponent } from './vendedores/nuevo-vendedor/nuevo-vendedor.component';
import { NuevoClienteComponent } from './clientes/nuevo-cliente/nuevo-cliente.component';
import { NuevaFormaPagoComponent } from './formas-de-pago/nueva-forma-pago/nueva-forma-pago.component';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module';
import { NuevaCondicionPagoComponent } from './condicion-de-pago/nueva-condicion-pago/nueva-condicion-pago.component';
import { NuevoDocumentoComponent } from './documentos/nuevo-documento/nuevo-documento.component';
import { AMantenimientoModule } from '../../almacen/a-mantenimientos/a-mantenimiento.module';


@NgModule({
  declarations: [
    ClientesComponent,
      NuevoClienteComponent,
      
    VendedoresComponent,
      NuevoVendedorComponent,

    CondicionDePagoComponent,
      NuevaCondicionPagoComponent,

    FormasDePagoComponent,
      NuevaFormaPagoComponent,

    DocumentosComponent,
      NuevoDocumentoComponent,

    TipoDeCambioComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule,
    SharedModulosModule,
    VMantenimientosRoutingModule,
    AMantenimientoModule
  ],

  exports: [
    DocumentosComponent,  
    CondicionDePagoComponent
  ]
})
export class VMantenimientosModule { }
