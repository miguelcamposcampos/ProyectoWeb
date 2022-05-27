import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';  

const routes: Routes = [  
    {
      path: 'mantenimientos-almacen',
      loadChildren: () => import('./a-mantenimientos/a-mantenimiento.module').then(m => m.AMantenimientoModule),
      canLoad : [AuthGuard],
      canActivate : [AuthGuard]
    },
    {
      path: 'procesos-almacen',
      loadChildren: () => import('./a-procesos/a-procesos.module').then(m => m.AProcesosModule),
      canLoad : [AuthGuard],
      canActivate : [AuthGuard]
    },
    {
      path: 'reportes-almacen',
      loadChildren: () => import('./a-reportes/a-reportes.module').then(m => m.AReportesModule),
      canLoad : [AuthGuard],
      canActivate : [AuthGuard]
    },  
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
