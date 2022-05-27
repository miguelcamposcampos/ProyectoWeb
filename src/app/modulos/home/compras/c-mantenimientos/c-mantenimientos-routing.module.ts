import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { CentroCostoComponent } from './centro-costo/centro-costo.component';
import { CondicionPagoComponent } from './condicion-pago/condicion-pago.component'; 
import { DocumentosComprasComponent } from './documentos-compras/documentos-compras.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { TipoCambioComponent } from './tipo-cambio/tipo-cambio.component';

const routes: Routes = [
  { 
    path: 'centro-costo',
    component: CentroCostoComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'condicion-pago',
    component: CondicionPagoComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'documentos',
    component: DocumentosComprasComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'proveedores',
    component: ProveedoresComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'tipo-cambio',
    component: TipoCambioComponent,
    canActivate : [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CMantenimientosRoutingModule { }
