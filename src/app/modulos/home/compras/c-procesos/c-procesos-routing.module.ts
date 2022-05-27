import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { ComprasComponent } from './compras/compras.component';
import { ImportacionesComponent } from './importaciones/importaciones.component';
import { OrdenCompraComponent } from './orden-compra/orden-compra.component';
import { ReciboporhonorarioComponent } from './reciboporhonorario/reciboporhonorario.component';

const routes: Routes = [
  { 
    path: 'compras',
    component: ComprasComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'importaciones',
    component: ImportacionesComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'recibo-por-honorario',
    component: ReciboporhonorarioComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'orden-de-compra',
    component: OrdenCompraComponent,
    canActivate : [AuthGuard],
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CProcesosRoutingModule { }
