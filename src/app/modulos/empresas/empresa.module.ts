import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module'; 
import { AgregarEmpresaComponent } from './lista-empresas/agregar-empresa/agregar-empresa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { RolesComponent } from './roles/roles.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';    
import { PlanesComponent } from './lista-pedidos/planes/planes.component';
import { ListaPedidosComponent } from './lista-pedidos/lista-pedidos.component';
import { NotificarPagoComponent } from './lista-pedidos/notificar-pago/notificar-pago.component'; 
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { ListaEmpresasComponent } from './lista-empresas/lista-empresas.component';
import { SharedModulosModule } from '../shared_modulos/shared_modulos.module';   
@NgModule({
  declarations: [
    ListaEmpresasComponent, 
    AgregarEmpresaComponent,
    PlanesComponent,
    RolesComponent,
    ListaPedidosComponent,
    ListaUsuariosComponent, 
    NotificarPagoComponent, 
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    FormsModule,
    PrimeNGModule, 
    ReactiveFormsModule,  
    SharedModulosModule
  ],
  
})
export class EmpresaModule { }
