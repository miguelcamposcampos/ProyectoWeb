import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { CajaChicaComponent } from './caja-chica/caja-chica.component';
import { CobranzasComponent } from './cobranzas/cobranzas.component';
import { GuiaDeRemisionComponent } from './guia-de-remision/guia-de-remision.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { VentasElectronicasComponent } from './ventas-electronicas/ventas-electronicas.component';
import { VentasComponent } from './ventas/ventas.component';


const routes: Routes = [
  {
    path: 'cobranzas',
    component: CobranzasComponent,
    canActivate : [AuthGuard],    
  },
  {
    path: 'guia-de-remision',
    component: GuiaDeRemisionComponent,
    canActivate : [AuthGuard],    
  },
  {
    path: 'ventas',
    component: VentasComponent,
    canActivate : [AuthGuard],    
  },
  {
    path: 'ventas-electronicas',
    component: VentasElectronicasComponent,
    canActivate : [AuthGuard],    
  },
  {
    path: 'pedidos',
    component: PedidosComponent,
    canActivate : [AuthGuard],    
  },
  {
    path: 'caja-chica',
    component: CajaChicaComponent,
    canActivate : [AuthGuard],    
  }
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VProcesosRoutingModule { }
