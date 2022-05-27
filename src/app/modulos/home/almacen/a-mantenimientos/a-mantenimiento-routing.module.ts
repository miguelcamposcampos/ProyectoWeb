import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { EstablecimientosComponent } from './establecimientos/establecimientos.component';
import { LineasComponent } from './lineas/lineas.component';
import { MarcasComponent } from './marcas/marcas.component';
import { ProductosComponent } from './productos/productos.component';
import { PropiedadesAdicionalesComponent } from './propiedades-adicionales/propiedades-adicionales.component';
import { TipodecambioComponent } from './tipodecambio/tipodecambio.component';
import { TransportistasComponent } from './transportistas/transportistas.component';
import { UnidadesdemedidaComponent } from './unidadesdemedida/unidadesdemedida.component';

const routes: Routes = [
  {
    path: 'transportistas',
    component: TransportistasComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'productos',
    component: ProductosComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'unidades-de-medida',
    component: UnidadesdemedidaComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'tipo-cambio',
    component: TipodecambioComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'establecimientos',
    component: EstablecimientosComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'propiedades-adicionales',
    component: PropiedadesAdicionalesComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'linea',
    component: LineasComponent,
    canActivate : [AuthGuard]
  },
  {
    path: 'marca',
    component: MarcasComponent,
    canActivate : [AuthGuard]
  }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AMantenimientoRoutingModule { }
