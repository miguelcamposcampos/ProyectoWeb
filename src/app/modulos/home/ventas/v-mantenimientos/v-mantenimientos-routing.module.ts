import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { ClientesComponent } from './clientes/clientes.component';
import { CondicionDePagoComponent } from './condicion-de-pago/condicion-de-pago.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { FormasDePagoComponent } from './formas-de-pago/formas-de-pago.component';
import { TipoDeCambioComponent } from './tipo-de-cambio/tipo-de-cambio.component';
import { VendedoresComponent } from './vendedores/vendedores.component';


const routes: Routes = [
  {
    path: 'clientes',
    component: ClientesComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'condicion-de-pago',
    component: CondicionDePagoComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'documentos',
    component: DocumentosComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'formas-de-pago',
    component: FormasDePagoComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'tipo-de-cambio',
    component: TipoDeCambioComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'vendedores',
    component: VendedoresComponent,
    canActivate : [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VMantenimientosRoutingModule { }
