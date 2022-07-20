import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { TitulosComponent } from './titulos/titulos.component';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { SharedModulosRoutingModule } from './shared_modulos-routing.module'; 
import { BuscarPersonaComponent } from './buscar-persona/buscar-persona.component';
import { BuscarProductoComponent } from './buscar-producto/buscar-producto.component';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscarTransportistaComponent } from './buscar-transportista/buscar-transportista.component';
import { BuscarUbigeoComponent } from './buscar-ubigeo/buscar-ubigeo.component';
import { BuscarPendienteComponent } from './buscar-pendiente/buscar-pendiente.component';
import { BuscarAnticipoComponent } from './buscar-anticipo/buscar-anticipo.component';
import { BuscarCentrocostoComponent } from './buscar-centrocosto/buscar-centrocosto.component';
import { BuscarTipoCuentaComponent } from './buscar-tipo-cuenta/buscar-tipo-cuenta.component';
 
@NgModule({
  declarations: [ 
    TitulosComponent, 
    BuscarPersonaComponent,
    BuscarProductoComponent,
    BuscarTransportistaComponent,
    BuscarUbigeoComponent,
    BuscarPendienteComponent,
    BuscarAnticipoComponent,
    BuscarCentrocostoComponent,
    BuscarTipoCuentaComponent
  ],
  imports: [
    CommonModule,
    SharedModulosRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PrimeNGModule, 
  
  ],
  exports:[ 
    TitulosComponent,
    BuscarPersonaComponent,
    BuscarProductoComponent,
    BuscarTransportistaComponent,
    BuscarUbigeoComponent,
    BuscarPendienteComponent,
    BuscarAnticipoComponent,
    BuscarCentrocostoComponent,
    BuscarTipoCuentaComponent
    
  ]
})
export class SharedModulosModule { }
