import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'mantenimientos-contabilidad',
    loadChildren: () => import('./cnt-mantenimientos/cnt-mantenimientos.module').then(m => m.CntMantenimientosModule),
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard]
  },
  {
    path: 'procesos-contabilidad',
    loadChildren: () => import('./cnt-procesos/cnt-procesos.module').then(m => m.CntProcesosModule),
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilidadRoutingModule { }
