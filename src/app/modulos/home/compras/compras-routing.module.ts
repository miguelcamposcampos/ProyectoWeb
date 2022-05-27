import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';

const routes: Routes = [  
  {
    path: 'mantenimientos-compras',
    loadChildren: () => import('./c-mantenimientos/c-mantenimientos.module').then(m => m.CMantenimientosModule),
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard]
  },
  {
    path: 'procesos-compras',
    loadChildren: () => import('./c-procesos/c-procesos.module').then(m => m.CProcesosModule),
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard]
  },
  {
    path: 'reportes-compras',
    loadChildren: () => import('./c-reportes/c-reportes.module').then(m => m.CReportesModule),
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard]
  },  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
