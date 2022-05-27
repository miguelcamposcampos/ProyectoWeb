import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { ConsultaStockComponent } from './consulta-stock/consulta-stock.component';
import { GuiasDeRemisionComponent } from './guias-de-remision/guias-de-remision.component';
import { MovimientosAlmacenComponent } from './movimientos-almacen/movimientos-almacen.component';
import { TomaInventarioComponent } from './toma-inventario/toma-inventario.component';

const routes: Routes = [
  {
    path: 'consulta-stock',
    component: ConsultaStockComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'movimientos-almacen',
    component: MovimientosAlmacenComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'guia-de-remision',
    component: GuiasDeRemisionComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'toma-de-inventario',
    component: TomaInventarioComponent,
    canActivate : [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AProcesosRoutingModule { }
