import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';


const routes: Routes = [  
  {
    path: 'mantenimientos-ventas',
    loadChildren: () => import('./v-mantenimientos/v-mantenimientos.module').then(m => m.VMantenimientosModule),
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard],
  },
  {
    path: 'procesos-ventas',
    loadChildren: () => import('./v-procesos/v-procesos.module').then(m => m.VProcesosModule),
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard],
  },
  {
    path: 'reportes-ventas',
    loadChildren: () => import('./v-reportes/v-reportes.module').then(m => m.VReportesModule),
    canLoad : [AuthGuard],
    canActivateChild : [AuthGuard],
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
